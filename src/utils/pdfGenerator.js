import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'

export const generatePDF = (policy) => {
  const doc = new jsPDF()
  
  // Add company logo and header
  doc.setFontSize(20)
  doc.setTextColor(7, 69, 142) // #07458E
  doc.text('IORTA Insurance', 20, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Policy Document', 20, 30)

  // Add Policy Details Section
  const policyDetails = [
    ['Policy Number', policy.TXT_POLICY_NO],
    ['Renewal Start Date', format(new Date(policy.DAT_RENEWAL_INCEPTION_DATE), 'dd/MM/yyyy')],
    ['Renewal End Date', format(new Date(policy.DAT_RENEWAL_EXPIRY_DATE), 'dd/MM/yyyy')],
    ['Customer Type', policy.TXT_CUSTOMERTYPE],
    ['Product Name', policy.TXT_PRODUCT_NAME]
  ]

  doc.autoTable({
    startY: 40,
    head: [['Policy Information', '']],
    body: policyDetails,
    theme: 'grid',
    headStyles: { fillColor: [7, 69, 142], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 } }
  })

  // Add Vehicle Details Section
  const vehicleDetails = [
    ['Vehicle Make', policy.TXT_VEICHLE_MAKE_NAME],
    ['Vehicle Model', policy.TXT_VEICHLE_MOD_NAME],
    ['Registration Date', format(new Date(policy.DAT_DATEOFREGISTRATION), 'dd/MM/yyyy')],
    ['Registration Number', policy.TXT_REGISTRATIONNUMBER],
    ['Engine Number', policy.TXT_ENGINE_NO],
    ['Chassis Number', policy.TXT_CHAIS_NO],
    ['Cubic Capacity', policy.NUM_CUBIC_CAPACITY],
    ['Seating Capacity', policy.NUM_SEATINGCAPACITY]
  ]

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Vehicle Information', '']],
    body: vehicleDetails,
    theme: 'grid',
    headStyles: { fillColor: [7, 69, 142], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 } }
  })

  // Add Premium Details Section
  const premiumDetails = [
    ['IDV', `₹${policy.NUM_USERVEHICLEIDV.toLocaleString()}`],
    ['NCB %', `${policy.NUM_PREVIOUSYEARNCB}%`],
    ['Body Price', `₹${policy.NUM_BODY_PRICE.toLocaleString()}`],
    ['Ex-showroom Price', `₹${policy.NUM_EXSHOWROOMPRICE.toLocaleString()}`],
    ['Underwriting Loading', `${policy.NUM_UNDERWRITINGLOADING}%`],
    ['Underwriting Discount', `${policy.NUM_UNDERWRITINGDISCOUNT}%`],
    ['Add-on Bundle', policy.TXT_ADDONBUNDLE],
    ['Base Premium', `₹${calculateBasePremium(policy).toLocaleString()}`],
    ['GST (18%)', `₹${calculateGST(policy).toLocaleString()}`],
    ['Total Premium', `₹${calculateTotalPremium(policy).toLocaleString()}`]
  ]

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Premium Information', '']],
    body: premiumDetails,
    theme: 'grid',
    headStyles: { fillColor: [7, 69, 142], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 80 } }
  })

  // Add Footer
  const footerText = `Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')} | This is a computer generated document.`
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(footerText, 20, doc.internal.pageSize.height - 10)

  // Add Page Numbers
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
  }

  return doc
}

// Premium calculation helpers
const calculateBasePremium = (policy) => {
  const baseRate = 0.02 // 2% of IDV as base premium
  let premium = policy.NUM_USERVEHICLEIDV * baseRate
  
  // Apply loading
  if (policy.NUM_UNDERWRITINGLOADING) {
    premium *= (1 + policy.NUM_UNDERWRITINGLOADING / 100)
  }
  
  // Apply discount
  if (policy.NUM_UNDERWRITINGDISCOUNT) {
    premium *= (1 - policy.NUM_UNDERWRITINGDISCOUNT / 100)
  }
  
  // Apply NCB
  if (policy.NUM_PREVIOUSYEARNCB) {
    premium *= (1 - policy.NUM_PREVIOUSYEARNCB / 100)
  }
  
  return Math.round(premium)
}

const calculateGST = (policy) => {
  const basePremium = calculateBasePremium(policy)
  return Math.round(basePremium * 0.18) // 18% GST
}

const calculateTotalPremium = (policy) => {
  const basePremium = calculateBasePremium(policy)
  const gst = calculateGST(policy)
  return basePremium + gst
}