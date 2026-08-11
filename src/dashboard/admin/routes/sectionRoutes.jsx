import ProductsPage from '../pages/ProductsPage'
import AddProductPage from '../pages/AddProductPage'
import CategoriesPage from '../pages/CategoriesPage'
import AddCategoryPage from '../pages/AddCategoryPage'
import OrdersPage from '../pages/OrdersPage'
import CustomersPage from '../pages/CustomersPage'
import CouponsPage from '../pages/CouponsPage'
import ReviewsPage from '../pages/ReviewsPage'
import BannerPage from '../pages/BannerPage'
import MediaPage from '../pages/MediaPage'
import ReportsPage from '../pages/ReportsPage'
import SettingsPage from '../pages/SettingsPage'
import ProfilePage from '../pages/ProfilePage'
import LogoutPage from '../pages/LogoutPage'
import AddProductForm from '../pages/AddProductForm'

export function renderSectionPage(pathname) {
  if (pathname === '/admin/products') return <ProductsPage />
  if (pathname === '/admin/products/add') return <AddProductPage />
  if (pathname === '/admin/products/Form') return <AddProductForm />
  if (pathname === '/admin/categories') return <CategoriesPage />
  if (pathname === '/admin/categories/add') return <AddCategoryPage />
  if (pathname === '/admin/orders') return <OrdersPage />
  if (pathname === '/admin/customers') return <CustomersPage />
  if (pathname === '/admin/coupons') return <CouponsPage />
  if (pathname === '/admin/reviews') return <ReviewsPage />
  if (pathname === '/admin/banner') return <BannerPage />
  if (pathname === '/admin/media') return <MediaPage />
  if (pathname.startsWith('/admin/reports')) return <ReportsPage />
  if (pathname === '/admin/settings') return <SettingsPage />
  if (pathname === '/admin/profile') return <ProfilePage />
  if (pathname === '/admin/logout') return <LogoutPage />
  return null
}
