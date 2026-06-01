export default {
  name: 'portfolio',
  title: 'Selected Portfolio Films',
  type: 'document',
  fields: [
    { name: 'title', title: 'Property Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    { name: 'locationRef', title: 'Target Regional Hub', type: 'reference', to: [{ type: 'locationPage' }] },
    { name: 'subtitle', title: 'Film Type / Subtitle', type: 'string', description: 'e.g. River, Alpine, Working Ranch' },
    { name: 'cloudinaryPublicId', title: 'Cloudinary Asset Key', type: 'string' },
    { name: 'propertyType', title: 'Market Category', type: 'string', options: { list: ['Ranch', 'Luxury Residential', 'Industrial', 'River Reserve'] } },
    { name: 'listingPrice', title: 'Market Evaluation / Valuation', type: 'string' },
    { name: 'daysOnMarket', title: 'Days on Market Until Conversion', type: 'number' },
    { name: 'architect', title: 'Lead Architectural Firm', type: 'string' },
    { name: 'featured', title: 'Promote to Home Slate', type: 'boolean', initialValue: false },
    {
      name: 'operationalMetadata',
      title: 'Drone Flight Telemetry Metrics',
      type: 'object',
      fields: [
        { name: 'sustainedWindMPH', title: 'Sustained Wind Index (MPH)', type: 'number' },
        { name: 'flightAltitudeAGL', title: 'Operational Flight Floor (Feet AGL)', type: 'number' }
      ]
    },
    { name: 'caseStudyBody', title: 'Editorial Review / Metrics Analysis', type: 'array', of: [{ type: 'block' }] }
  ]
};
