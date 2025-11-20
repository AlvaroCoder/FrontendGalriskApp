import React from 'react'
import { 
  User, 
  Mail, 
  Key, 
  Edit3,
  Shield,
  Sparkles
} from 'lucide-react'


export default function UserProfile({ userData }) {
    
  const user = userData || {
    username: "juanperez",
    email: "juan.perez@empresa.com",
    password: "••••••••", 
    fecha_creacion: "2024-01-15T10:30:00Z"
  }
    
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-intense/20 border border-yellow-intense/30 mb-4">
          <Sparkles className="w-4 h-4 text-nigth-blue" />
          <span className="text-sm font-semibold text-nigth-blue">
            Perfil de Usuario
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-nigth-blue mb-4">
          Mi 
          <span className="bg-gradient-to-r from-yellow-intense to-orange-400 bg-clip-text text-transparent"> Cuenta</span>
        </h2>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Gestiona tu información personal y revisa los detalles de tu cuenta en Gallrisk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <div className="
            bg-white
            rounded-2xl
            p-6
            shadow-lg
            border
            border-gray-200/50
            text-center
            sticky
            top-6
          ">
            <div className="
              w-24
              h-24
              mx-auto
              mb-4
              rounded-2xl
              bg-gradient-to-br
              from-yellow-intense
              to-orange-400
              flex
              items-center
              justify-center
              shadow-lg
            ">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-nigth-blue mb-2">
              {user.username}
            </h3>
            
            <div className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              bg-green-50
              border
              border-green-200
              text-green-700
              text-sm
              font-medium
            ">
              <Shield className="w-3 h-3" />
              Cuenta Verificada
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="
            bg-white
            rounded-2xl
            shadow-lg
            border
            border-gray-200/50
            overflow-hidden
          ">
            <div className="
              bg-gradient-to-r
              from-gray-50
              to-gray-100
              px-6
              py-4
              border-b
              border-gray-200
            ">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-nigth-blue">
                  Información Personal
                </h4>
                <button className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  bg-yellow-intense
                  text-nigth-blue
                  font-medium
                  text-sm
                  transition-all
                  duration-200
                  hover:shadow-lg
                  hover:scale-105
                  active:scale-95
                ">
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-blue-50
                  border
                  border-blue-200
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  group-hover:scale-105
                  transition-transform
                  duration-200
                ">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Nombre de Usuario
                  </label>
                  <p className="text-nigth-blue font-semibold">
                    {user.username}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Tu identificador único en la plataforma
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-green-50
                  border
                  border-green-200
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  group-hover:scale-105
                  transition-transform
                  duration-200
                ">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Correo Electrónico
                  </label>
                  <p className="text-nigth-blue font-semibold">
                    {user.email}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Dirección de correo asociada a tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-red-50
                  border
                  border-red-200
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  group-hover:scale-105
                  transition-transform
                  duration-200
                ">
                  <Key className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Contraseña
                  </label>
                  <p className="text-nigth-blue font-semibold">
                    {user.password}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    •••••••• (solo visible como placeholder)
                  </p>
                </div>
              </div>
            </div>

            <div className="
              bg-gray-50
              px-6
              py-4
              border-t
              border-gray-200
              text-center
            ">
              <p className="text-sm text-gray-600">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}