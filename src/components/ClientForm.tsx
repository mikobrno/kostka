import React, { useState } from 'react';
import { ClientService } from '../services/clientService';
import { PersonalInfo } from './forms/PersonalInfo';
import { EmployerInfo } from './forms/EmployerInfo';
import { LiabilitiesInfo } from './forms/LiabilitiesInfo';
import { PropertyInfo } from './forms/PropertyInfo';
import { Save, Download, Plus } from 'lucide-react';

interface ClientFormProps {
  selectedClient?: any;
}

export const ClientForm: React.FC<ClientFormProps> = ({ selectedClient }) => {
  const [formData, setFormData] = useState({
    applicant: {},
    coApplicant: {},
    employer: {},
    liabilities: [],
    property: {}
  });
  const [saving, setSaving] = useState(false);

  // Načtení dat vybraného klienta do formuláře
  React.useEffect(() => {
    if (selectedClient) {
      setFormData({
        applicant: {
          title: selectedClient.applicant_title || '',
          firstName: selectedClient.applicant_firstName || '',
          lastName: selectedClient.applicant_lastName || '',
          birthNumber: selectedClient.applicant_birthNumber || '',
          age: selectedClient.applicant_age || '',
          maritalStatus: selectedClient.applicant_maritalStatus || '',
          permanentAddress: selectedClient.applicant_permanentAddress || '',
          contactAddress: selectedClient.applicant_contactAddress || '',
          documentType: selectedClient.applicant_documentType || '',
          documentNumber: selectedClient.applicant_documentNumber || '',
          documentIssueDate: selectedClient.applicant_documentIssueDate || '',
          documentValidUntil: selectedClient.applicant_documentValidUntil || '',
          phone: selectedClient.applicant_phone || '',
          email: selectedClient.applicant_email || '',
          bank: selectedClient.applicant_bank || '',
          children: selectedClient.applicant_children ? JSON.parse(selectedClient.applicant_children) : []
        },
        coApplicant: {
          title: selectedClient.coApplicant_title || '',
          firstName: selectedClient.coApplicant_firstName || '',
          lastName: selectedClient.coApplicant_lastName || '',
          birthNumber: selectedClient.coApplicant_birthNumber || '',
          age: selectedClient.coApplicant_age || '',
          maritalStatus: selectedClient.coApplicant_maritalStatus || '',
          permanentAddress: selectedClient.coApplicant_permanentAddress || '',
          contactAddress: selectedClient.coApplicant_contactAddress || '',
          documentType: selectedClient.coApplicant_documentType || '',
          documentNumber: selectedClient.coApplicant_documentNumber || '',
          documentIssueDate: selectedClient.coApplicant_documentIssueDate || '',
          documentValidUntil: selectedClient.coApplicant_documentValidUntil || '',
          phone: selectedClient.coApplicant_phone || '',
          email: selectedClient.coApplicant_email || '',
          bank: selectedClient.coApplicant_bank || '',
          children: selectedClient.coApplicant_children ? JSON.parse(selectedClient.coApplicant_children) : []
        },
        employer: {
          ico: selectedClient.employer_ico || '',
          companyName: selectedClient.employer_companyName || '',
          companyAddress: selectedClient.employer_companyAddress || '',
          netIncome: selectedClient.employer_netIncome || ''
        },
        liabilities: selectedClient.liabilities ? JSON.parse(selectedClient.liabilities) : [],
        property: {
          address: selectedClient.property_address || '',
          price: selectedClient.property_price || ''
        }
      });
    }
  }, [selectedClient]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (selectedClient) {
        // Aktualizace existujícího klienta
        const { data, error } = await ClientService.updateClient(selectedClient.id, formData);
        if (error) {
          throw new Error(error.message || 'Chyba při aktualizaci klienta');
        }
        alert('Klient byl úspěšně aktualizován!');
      } else {
        // Vytvoření nového klienta
        const { data, error } = await ClientService.createClient(formData);
        if (error) {
          throw new Error(error.message || 'Chyba při vytváření klienta');
        }
        alert('Klient byl úspěšně vytvořen!');
        
        // Vyčištění formuláře po úspěšném vytvoření
        setFormData({
          applicant: {},
          coApplicant: {},
          employer: {},
          liabilities: [],
          property: {}
        });
      }
    } catch (error) {
      console.error('Chyba při ukládání:', error);
      alert(`Chyba při ukládání: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implementovat export do PDF
    alert('PDF bude vygenerováno!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedClient ? 'Úprava klienta' : 'Nový klient'}
          </h1>
          {selectedClient && (
            <p className="text-gray-600 mt-1">
              {selectedClient.applicant_firstName} {selectedClient.applicant_lastName}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {saving ? (
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Ukládám...' : (selectedClient ? 'Aktualizovat' : 'Uložit')}
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Žadatel
            </h2>
            <PersonalInfo 
              data={formData.applicant}
              onChange={(data) => setFormData(prev => ({ ...prev, applicant: data }))}
              prefix="applicant"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Spolužadatel
            </h2>
            <PersonalInfo 
              data={formData.coApplicant}
              onChange={(data) => setFormData(prev => ({ ...prev, coApplicant: data }))}
              prefix="coApplicant"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
            Zaměstnavatel
          </h2>
          <EmployerInfo 
            data={formData.employer}
            onChange={(data) => setFormData(prev => ({ ...prev, employer: data }))}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
            Nemovitost
          </h2>
          <PropertyInfo 
            data={formData.property}
            onChange={(data) => setFormData(prev => ({ ...prev, property: data }))}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-900">Závazky</h2>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Přidat závazek
          </button>
        </div>
        <LiabilitiesInfo 
          data={formData.liabilities}
          onChange={(data) => setFormData(prev => ({ ...prev, liabilities: data }))}
        />
      </div>
    </div>
  );
};