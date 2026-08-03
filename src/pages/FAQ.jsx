import Breadcrumb from '../components/Breadcrumb'
import FAQComponent from '../components/FAQ'

export default function FAQPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      <FAQComponent />
    </>
  )
}
