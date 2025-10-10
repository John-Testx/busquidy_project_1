import React from "react";
import { Controller } from "react-hook-form";

export default function StepProjectDetails({ control }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#07767c]/20">
          Detalles Adicionales
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Habilidades Requeridas <span className="text-red-500">*</span>
        </label>
        <Controller
          name="habilidades_requeridas"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                placeholder="Ej: React, Node.js, PostgreSQL, Diseño UX/UI"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Presupuesto Estimado (CLP) <span className="text-red-500">*</span>
        </label>
        <Controller
          name="presupuesto"
          control={control}
          rules={{ required: "El presupuesto es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  {...field}
                  placeholder="500000"
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Duración Estimada <span className="text-red-500">*</span>
        </label>
        <Controller
          name="duracion_estimada"
          control={control}
          rules={{ required: "La duración es obligatoria" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                placeholder="Ej: 2 semanas, 1 mes, 3 meses"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Fecha Límite de Entrega <span className="text-red-500">*</span>
        </label>
        <Controller
          name="fecha_limite"
          control={control}
          rules={{ required: "La fecha límite es obligatoria" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                type="date"
                {...field}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
}