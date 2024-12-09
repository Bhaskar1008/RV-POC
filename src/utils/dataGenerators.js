import { format, addDays } from 'date-fns'

export const generatePolicyData = () => {
  const startDate = new Date()
  const endDate = addDays(startDate, 365)
  const registrationDate = addDays(startDate, -Math.floor(Math.random() * 1825)) // Up to 5 years old

  const vehicleMakes = ['Honda', 'Toyota', 'Maruti', 'Hyundai', 'Tata', 'Mahindra']
  const selectedMake = vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)]
  
  const modelsByMake = {
    Honda: ['City', 'Civic', 'Amaze', 'WR-V'],
    Toyota: ['Innova', 'Fortuner', 'Glanza', 'Camry'],
    Maruti: ['Swift', 'Baleno', 'Brezza', 'Ertiga'],
    Hyundai: ['i20', 'Creta', 'Venue', 'Verna'],
    Tata: ['Nexon', 'Harrier', 'Safari', 'Punch'],
    Mahindra: ['XUV700', 'Thar', 'Scorpio', 'XUV300']
  }

  const selectedModel = modelsByMake[selectedMake][Math.floor(Math.random() * modelsByMake[selectedMake].length)]

  const states = ['MH', 'DL', 'KA', 'TN', 'GJ', 'UP', 'RJ']
  const state = states[Math.floor(Math.random() * states.length)]
  const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const regNumber = `${state}${Math.floor(Math.random() * 100)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${numbers}`

  return {
    TXT_POLICY_NO: `P${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    DAT_RENEWAL_INCEPTION_DATE: format(startDate, 'yyyy-MM-dd'),
    DAT_RENEWAL_EXPIRY_DATE: format(endDate, 'yyyy-MM-dd'),
    TXT_CUSTOMERTYPE: ['Individual', 'Corporate', 'Government'][Math.floor(Math.random() * 3)],
    TXT_PRODUCT_NAME: ['Motor', 'Travel', 'Personal Accident', 'GCV', 'PCV'][Math.floor(Math.random() * 5)],
    TXT_POLICY_VARIANT: ['Basic', 'Premium', 'Elite'][Math.floor(Math.random() * 3)],
    TXT_VEICHLE_MAKE_NAME: selectedMake,
    TXT_VEICHLE_MOD_NAME: selectedModel,
    TXT_VARIANT: ['VX', 'ZX', 'LXI', 'VXI'][Math.floor(Math.random() * 4)],
    NUM_VEICHLE_MAKE_YR: 2018 + Math.floor(Math.random() * 6),
    TXT_FUEL_TYPE: ['Petrol', 'Diesel', 'CNG', 'Electric'][Math.floor(Math.random() * 4)],
    TXT_RTO_LOC: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][Math.floor(Math.random() * 4)],
    DAT_DATEOFREGISTRATION: format(registrationDate, 'yyyy-MM-dd'),
    TXT_REGISTRATIONNUMBER: regNumber,
    TXT_ENGINE_NO: `ENG${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    TXT_CHAIS_NO: `CHS${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    NUM_CUBIC_CAPACITY: 1000 + Math.floor(Math.random() * 2000),
    NUM_SEATINGCAPACITY: 2 + Math.floor(Math.random() * 6),
    NUM_PREVIOUSYEARNCB: [0, 20, 25, 35, 45, 50][Math.floor(Math.random() * 6)],
    NUM_BODY_PRICE: 100000 + Math.floor(Math.random() * 900000),
    NUM_EXSHOWROOMPRICE: 500000 + Math.floor(Math.random() * 1500000),
    NUM_USERVEHICLEIDV: 400000 + Math.floor(Math.random() * 1200000),
    TXT_ADDONBUNDLE: ['Bundle A', 'Bundle B', 'Bundle C'][Math.floor(Math.random() * 3)],
    NUM_UNDERWRITINGLOADING: Math.floor(Math.random() * 20),
    NUM_UNDERWRITINGDISCOUNT: Math.floor(Math.random() * 15)
  }
}