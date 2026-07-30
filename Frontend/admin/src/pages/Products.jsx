import { useEffect, useState } from "react"
import { Search, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import adminApi from "../services/adminApi"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog"

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await adminApi.get(`/admin/products/paginated?page=${page}&limit=8&search=${search}`)
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const deleteProduct = async () => {
    if (!deleteConfirm) return
    const old = [...products]
    setProducts(products.filter((p) => p._id !== deleteConfirm))
    try {
      await adminApi.delete(`/admin/product/${deleteConfirm}`)
      fetchProducts()
    } catch (err) {
      setProducts(old)
    }
    setDeleteConfirm(null)
  }

  const updateProduct = async () => {
    if (!selectedProduct) return
    setSaving(true)
    try {
      const payload = { ...selectedProduct }
      if (payload.image instanceof File) {
        const formData = new FormData()
        formData.append("image", payload.image)
        formData.append("name", payload.name)
        formData.append("price", payload.price)
        formData.append("stock", payload.stock)
        formData.append("category", payload.category)
        await adminApi.put(`/admin/product/${payload._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await adminApi.put(`/admin/product/${payload._id}`, payload)
      }
      setSelectedProduct(null)
      setImagePreview(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedProduct({ ...selectedProduct, image: file })
    setImagePreview(URL.createObjectURL(file))
  }

  const openEdit = (product) => {
    setSelectedProduct({ ...product })
    setImagePreview(product.image || null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 w-60"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
            />
          </div>
          <Button asChild>
            <a href="/create-product"><Plus className="mr-1 h-4 w-4" /> Add</a>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No products found.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-6 px-6">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        {p.image ? (
                          <img src={p.image} alt="" onError={(e) => e.target.style.display = "none"} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="whitespace-nowrap">Rs. {p.price?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={p.stock > 0 ? "success" : "destructive"}>{p.stock}</Badge>
                      </TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteConfirm(p._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={!!selectedProduct} onOpenChange={(o) => { if (!o) { setSelectedProduct(null); setImagePreview(null) } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={selectedProduct?.name || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
            <Input type="number" placeholder="Price" value={selectedProduct?.price || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })} />
            <Input type="number" placeholder="Stock" value={selectedProduct?.stock || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })} />
            <Input placeholder="Category" value={selectedProduct?.category || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} />
            <Input type="file" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="" className="h-20 w-20 object-cover rounded" />}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedProduct(null); setImagePreview(null) }}>Cancel</Button>
            <Button onClick={updateProduct} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminProducts
