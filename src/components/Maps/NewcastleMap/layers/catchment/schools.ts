export type School = {
  label: string
  address: string
  type: string
  catchment?: string
  logo?: string
  fillColor?: string
  outlineColor?: string
}

// combined catchment layer
export const defaultFillColor = '#76c176' // Light green
export const defaultOutlineColor = '#008000'

// Fixed array of addresses to add pins for
export const SCHOOLS: School[] = [
  {
    label: 'Macquarie College',
    address: '182-222 Lake Rd, Wallsend NSW 2287',
    type: 'Private School',
    logo: '/logos/macquarie-college.png',
  },
  {
    label: 'Lambton Public School',
    address: '18-30 Croudace St LAMBTON  2299',

    type: 'Public School',
    catchment: 'lambton-ps',
    logo: '/logos/lambton-public.png', // yellow
    fillColor: '#fcfc7c',
    outlineColor: '#e6e600',
  },
  {
    label: 'New Lambton Public School',
    address: 'Regent St, New Lambton NSW 2305',
    type: 'Public School',
    catchment: 'new-lambton-ps',
    logo: '/logos/new-lambton-public.png',
    // light brown
    fillColor: '#d9d9b3',
    outlineColor: '#b3b38c',
  },
  {
    label: 'Wallsend South Public School',
    address: '16 Smith Rd, Elermore Vale NSW 2287',

    type: 'Public School',
    catchment: 'wallsend-sp',
    logo: '/logos/wallsend-south-public.png',
    //purple
    fillColor: '#c46ec4',
    outlineColor: '#c722c7',
  },
  {
    label: 'Lambton High School',
    address: '15 Young Road, Lambton, NSW 2299',

    type: 'High School',
    catchment: 'lambton-hs',
    logo: '/logos/lambton-high.png',
    // green
    fillColor: '#fc90ba',
    outlineColor: '#f75494',
  },
  // Add more addresses here as needed
]

// Helper function to get school colors by catchment ID
export const getSchoolColors = (
  catchmentId: string,
): { fillColor: string; outlineColor: string } | null => {
  const school = SCHOOLS.find((s) => s.catchment === catchmentId)
  if (!school || !school.fillColor || !school.outlineColor) return null
  return {
    fillColor: school.fillColor,
    outlineColor: school.outlineColor,
  }
}
