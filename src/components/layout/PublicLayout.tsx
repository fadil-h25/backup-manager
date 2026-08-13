import type { PropsWithChildren } from 'hono/jsx'
import { PageHead } from './PageHead.js'
import { PageScripts } from './PageScripts.js'

interface PublicLayoutProps {
    title: string
}

export const PublicLayout = ({
    title,
    children,
}: PropsWithChildren<PublicLayoutProps>) => {
    return (
        <html lang="en">
            <PageHead title={title} />

            <body class="min-h-screen bg-gray-100">
                {children}

                <PageScripts />
            </body>
        </html>
    )
}