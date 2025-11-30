import { MetadataRoute } from 'next'
import { useCases } from '@/lib/use-cases'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://justunlock.link'

    const useCaseUrls = useCases.map((useCase) => ({
        url: `${baseUrl}/use-cases/${useCase.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...useCaseUrls,
    ]
}
