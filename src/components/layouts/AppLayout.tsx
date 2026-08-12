import type { PropsWithChildren } from 'hono/jsx'
import { PageHead } from './PageHead.js'
import { PageScripts } from './PageScripts.js'

interface AppLayoutProps {
    title: string
}

export const AppLayout = ({
    title,
    children,
}: PropsWithChildren<AppLayoutProps>) => {
    return (
        <html lang="en">
            <PageHead title={title} />

            <body>
                {children}

                <PageScripts />
            </body>
        </html>
    )
}