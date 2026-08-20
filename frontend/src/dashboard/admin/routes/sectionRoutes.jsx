import ProductsPage from '../pages/ProductsPage'
import CategoriesPage from '../pages/CategoriesPage'
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
import AddCategory from '../pages/AddCategory'
import ContactPage from '../pages/ContactPage'

export function renderSectionPage(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/admin'
  if (path === '/admin/products') return <ProductsPage />
  if (path === '/admin/categories') return <CategoriesPage />
  if (path === '/admin/categories/add') return <AddCategory />
  if (path === '/admin/orders') return <OrdersPage />
  if (path === '/admin/customers') return <CustomersPage />
  if (path === '/admin/coupons') return <CouponsPage />
  if (path === '/admin/reviews') return <ReviewsPage />
  if (path === '/admin/banner') return <BannerPage />
  if (path === '/admin/media') return <MediaPage />
  if (path.startsWith('/admin/reports')) return <ReportsPage />
  if (path === '/admin/settings') return <SettingsPage />
  if (path === '/admin/profile') return <ProfilePage />
  if (path === '/admin/logout') return <LogoutPage />
   if (path === '/admin/contact') return <ContactPage />
  return null
}
