import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Rozšíření jsPDF typu pro autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateClientPDF = async (client: any, formData: any) => {
  const doc = new jsPDF();
  
  // Nastavení fontu pro češtinu
  doc.setFont('helvetica');
  
  // Hlavička dokumentu
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Klientský záznam', 20, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Vygenerováno: ${new Date().toLocaleDateString('cs-CZ')}`, 20, 35);
  
  let yPosition = 50;
  
  // Funkce pro formátování dat
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Neuvedeno';
    try {
      return new Date(dateString).toLocaleDateString('cs-CZ');
    } catch {
      return 'Neplatné datum';
    }
  };
  
  const formatPrice = (price: number | string) => {
    if (!price) return 'Neuvedeno';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('cs-CZ') + ' Kč';
  };
  
  // Žadatel
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('ŽADATEL', 20, yPosition);
  yPosition += 10;
  
  const applicantData = [
    ['Jméno a příjmení', `${formData.applicant.title || ''} ${formData.applicant.firstName || ''} ${formData.applicant.lastName || ''}`.trim()],
    ['Rodné číslo', formData.applicant.birthNumber || 'Neuvedeno'],
    ['Věk', formData.applicant.age ? `${formData.applicant.age} let` : 'Neuvedeno'],
    ['Rodinný stav', formData.applicant.maritalStatus || 'Neuvedeno'],
    ['Trvalé bydliště', formData.applicant.permanentAddress || 'Neuvedeno'],
    ['Kontaktní adresa', formData.applicant.contactAddress || 'Neuvedeno'],
    ['Telefon', formData.applicant.phone || 'Neuvedeno'],
    ['Email', formData.applicant.email || 'Neuvedeno'],
    ['Banka', formData.applicant.bank || 'Neuvedeno'],
    ['Typ dokladu', formData.applicant.documentType || 'Neuvedeno'],
    ['Číslo dokladu', formData.applicant.documentNumber || 'Neuvedeno'],
    ['Datum vydání', formatDate(formData.applicant.documentIssueDate)],
    ['Platnost do', formatDate(formData.applicant.documentValidUntil)]
  ];
  
  doc.autoTable({
    startY: yPosition,
    head: [['Údaj', 'Hodnota']],
    body: applicantData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 10 }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  // Spolužadatel (pokud existuje)
  if (formData.coApplicant.firstName) {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('SPOLUŽADATEL', 20, yPosition);
    yPosition += 10;
    
    const coApplicantData = [
      ['Jméno a příjmení', `${formData.coApplicant.title || ''} ${formData.coApplicant.firstName || ''} ${formData.coApplicant.lastName || ''}`.trim()],
      ['Rodné číslo', formData.coApplicant.birthNumber || 'Neuvedeno'],
      ['Věk', formData.coApplicant.age ? `${formData.coApplicant.age} let` : 'Neuvedeno'],
      ['Rodinný stav', formData.coApplicant.maritalStatus || 'Neuvedeno'],
      ['Telefon', formData.coApplicant.phone || 'Neuvedeno'],
      ['Email', formData.coApplicant.email || 'Neuvedeno'],
      ['Banka', formData.coApplicant.bank || 'Neuvedeno']
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Údaj', 'Hodnota']],
      body: coApplicantData,
      theme: 'grid',
      headStyles: { fillColor: [92, 184, 92] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Nová stránka pro další sekce
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 30;
  }
  
  // Zaměstnavatel (pokud existuje)
  if (formData.employer.companyName) {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('ZAMĚSTNAVATEL', 20, yPosition);
    yPosition += 10;
    
    const employerData = [
      ['Název firmy', formData.employer.companyName || 'Neuvedeno'],
      ['IČO', formData.employer.ico || 'Neuvedeno'],
      ['Adresa', formData.employer.companyAddress || 'Neuvedeno'],
      ['Čistý příjem', formData.employer.netIncome ? formatPrice(formData.employer.netIncome) : 'Neuvedeno']
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Údaj', 'Hodnota']],
      body: employerData,
      theme: 'grid',
      headStyles: { fillColor: [240, 173, 78] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Nemovitost (pokud existuje)
  if (formData.property.address) {
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('NEMOVITOST', 20, yPosition);
    yPosition += 10;
    
    const propertyData = [
      ['Adresa', formData.property.address || 'Neuvedeno'],
      ['Kupní cena', formData.property.price ? formatPrice(formData.property.price) : 'Neuvedeno']
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Údaj', 'Hodnota']],
      body: propertyData,
      theme: 'grid',
      headStyles: { fillColor: [217, 83, 79] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Závazky (pokud existují)
  if (formData.liabilities && formData.liabilities.length > 0) {
    // Nová stránka pro závazky pokud je potřeba
    if (yPosition > 150) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('ZÁVAZKY', 20, yPosition);
    yPosition += 10;
    
    const liabilitiesData = formData.liabilities.map((liability: any) => [
      liability.institution || 'Neuvedeno',
      liability.type || 'Neuvedeno',
      liability.amount ? formatPrice(liability.amount) : 'Neuvedeno',
      liability.payment ? formatPrice(liability.payment) : 'Neuvedeno',
      liability.balance ? formatPrice(liability.balance) : 'Neuvedeno'
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Instituce', 'Typ', 'Výše úvěru', 'Splátka', 'Zůstatek']],
      body: liabilitiesData,
      theme: 'grid',
      headStyles: { fillColor: [91, 192, 222] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Děti (pokud existují)
  const allChildren = [
    ...(formData.applicant.children || []).map((child: any) => ({ ...child, parent: 'Žadatel' })),
    ...(formData.coApplicant.children || []).map((child: any) => ({ ...child, parent: 'Spolužadatel' }))
  ];
  
  if (allChildren.length > 0) {
    // Nová stránka pro děti pokud je potřeba
    if (yPosition > 150) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('DĚTI', 20, yPosition);
    yPosition += 10;
    
    const childrenData = allChildren.map((child: any) => [
      child.parent,
      child.name || 'Neuvedeno',
      formatDate(child.birthDate),
      child.age ? `${child.age} let` : 'Neuvedeno'
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Rodič', 'Jméno', 'Datum narození', 'Věk']],
      body: childrenData,
      theme: 'grid',
      headStyles: { fillColor: [153, 102, 255] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 }
    });
  }
  
  // Uložení PDF
  const fileName = `klient_${formData.applicant.lastName || 'neznamy'}_${formData.applicant.firstName || 'neznamy'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};