import type { FC } from 'hono/jsx'

interface PageHeadProps {
    title: string
}

export const PageHead: FC<PageHeadProps> = ({ title }) => {
    return (
        <head>
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>{title} - Backup Manager</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
    )
}