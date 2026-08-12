import { AppLayout } from '../../components/layouts/AppLayout.js'

export const LoginPage = () => {
    return (
        <AppLayout title="Login">
            <main class="bg-gray-100 flex items-center justify-center h-screen">
                <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
                    <div class="text-center mb-6">
                        <h1 class="text-2xl font-bold text-gray-800">
                            Backup Manager
                        </h1>

                        <p class="text-sm text-gray-500 mt-1">
                            Silakan masuk ke akun instansi Anda
                        </p>
                    </div>

                    <form
                        action="/api/login"
                        method="post"
                        class="space-y-4"
                    >
                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                required
                                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </main>
        </AppLayout>
    )
}