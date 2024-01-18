import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    // redirect('/auth/login?returnTo=/perfil');
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg max-w-2xl">
        <Title title="Perfil" />

        <div className="flex flex-col items-center py-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
            {/* User image here */}
          </div>
          <h1 className="text-4xl font-semibold mt-4">{session.user.name}</h1>
          <p className="text-gray-600">{session.user.email}</p>
          <span className={`px-3 py-1 text-sm rounded-full ${session.user.role === 'admin' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} mt-3`}>
            {session.user.role.toUpperCase()}
          </span>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold">Detalles de Usuario</h3>
          <dl className="mt-2">
            <div className="px-4 py-2 bg-gray-50">
              <dt className="text-sm font-semibold text-gray-500">ID</dt>
              <dd className="text-sm text-gray-900">{session.user.id}</dd>
            </div>
            <div className="px-4 py-2">
              <dt className="text-sm font-semibold text-gray-500">Correo Verificado</dt>
              <dd className="text-sm text-gray-900">{session.user.emailVerified ? 'Si' : 'No'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
