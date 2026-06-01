export default {
  name: 'locationPage',
  title: 'Regional Operations Hub',
  type: 'document',
  fields: [
    { name: 'city', title: 'Regional Market Identity Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'URL Access Parameter Routing Key', type: 'slug', options: { source: 'city' } },
    { name: 'heroHeadline', title: 'Cinematic Landing Display Statement', type: 'string' },
    { name: 'heroCloudinaryId', title: 'Background Video Key Frame ID', type: 'string' },
    { name: 'seoBodyText', title: 'Hyper-Local SEO Knowledge Block (500+ Words)', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'structuredData',
      title: 'LocalBusiness Schema Injector Nodes',
      type: 'object',
      fields: [
        { name: 'streetAddress', type: 'string' },
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
        { name: 'telephone', type: 'string' }
      ]
    }
  ]
};
