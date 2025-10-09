import TextInput from "../../Common/TextInput";
import TextArea from "../../Common/TextArea";
import DateInput from "../../Common/DateInput";
import SelectInput from "../../Common/SelectInput";
import { optionsCategorySkills } from "../../../data/options";


export const Step1BasicInfo = ({ data, onChange }) => (
  <div className="perfil-freelancer-form-step">
    <TextArea
      label="Descripción"
      name="descripcion_freelancer"
      value={data.descripcion_freelancer}
      onChange={(e) => onChange('descripcion_freelancer', e.target.value)}
      placeholder="Escribe una breve descripción..."
      required
    />
    <div className="grupos-container-first">
      <TextInput
        label="Correo Contacto"
        name="correo_contacto"
        value={data.correo_contacto}
        onChange={(e) => onChange('correo_contacto', e.target.value)}
        required
      />
    </div>
    <div className="grupos-container-first">
      <TextInput
        label="Teléfono Contacto"
        name="telefono_contacto"
        value={data.telefono_contacto}
        onChange={(e) => onChange('telefono_contacto', e.target.value)}
        required
      />
    </div>
    <div className="grupos-container-first">
      <TextInput
        label="LinkedIn (Opcional)"
        name="linkedin_link"
        value={data.linkedin_link}
        onChange={(e) => onChange('linkedin_link', e.target.value)}
      />
    </div>
  </div>
);


export const Step2PersonalData = ({ data, onChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Datos Personales</h3>
    <div className="grupos-container">
      <TextInput
        label="Nombres"
        name="nombres"
        value={data.nombres}
        onChange={(e) => onChange('nombres', e.target.value)}
        required
      />
      <TextInput
        label="Apellidos"
        name="apellidos"
        value={data.apellidos}
        onChange={(e) => onChange('apellidos', e.target.value)}
        required
      />
    </div>
    {/* Add rest of fields... */}
  </div>
);

// Step3LaboralInclusion.jsx
export const Step3LaboralInclusion = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Inclusión Laboral</h3>
    <div className="grupos-container">
      <SelectInput
        label="¿Posee alguna discapacidad?"
        value={data.discapacidad}
        options={[
          { value: "Si", label: "Sí" },
          { value: "No", label: "No" },
        ]}
        onChange={(option) => onSelectChange('discapacidad', option.value)}
        style={{ width: "700px", marginLeft: "32px" }}
      />
    </div>

    {data.discapacidad === "Si" && (
      <>
        <div className="grupos-container">
          <TextInput
            label="Tipo de Discapacidad"
            name="tipo_discapacidad"
            value={data.tipo_discapacidad || ""}
            onChange={(e) => onChange('tipo_discapacidad', e.target.value)}
            required
          />
          <SelectInput
            label="¿Está registrado en el Registro Nacional?"
            value={data.registro_nacional}
            options={[
              { value: "Si", label: "Sí" },
              { value: "No", label: "No" },
              { value: "En trámite", label: "En trámite" },
            ]}
            onChange={(option) => onSelectChange('registro_nacional', option.value)}
            style={{ width: "350px", marginRight: "32px" }}
          />
        </div>

        <div className="grupos-container">
          <SelectInput
            label="¿Recibe pensión de invalidez?"
            value={data.pension_invalidez}
            options={[
              { value: "Si", label: "Sí" },
              { value: "No", label: "No" },
              { value: "En trámite", label: "En trámite" },
            ]}
            onChange={(option) => onSelectChange('pension_invalidez', option.value)}
            style={{ width: "700px", marginLeft: "32px" }}
          />
        </div>

        <div className="grupos-container">
          <TextArea
            label="¿Requiere algún ajuste para la entrevista?"
            name="ajuste_entrevista"
            value={data.ajuste_entrevista || ""}
            onChange={(e) => onChange('ajuste_entrevista', e.target.value)}
          />
        </div>
      </>
    )}
  </div>
);

// Step4Entrepreneurship.jsx
export const Step4Entrepreneurship = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Emprendimiento</h3>
    <div className="grupos-container">
      <SelectInput
        label="¿Es emprendedor?"
        value={data.emprendedor}
        options={[
          { value: "Si", label: "Sí" },
          { value: "No", label: "No" },
        ]}
        onChange={(option) => onSelectChange('emprendedor', option.value)}
        style={{ width: "700px", marginLeft: "32px" }}
      />
    </div>

    {data.emprendedor === "No" && (
      <div className="grupos-container">
        <SelectInput
          label="¿Te interesa emprender?"
          value={data.interesado}
          options={[
            { value: "Si", label: "Sí" },
            { value: "No", label: "No" },
          ]}
          onChange={(option) => onSelectChange('interesado', option.value)}
          style={{ width: "700px", marginLeft: "32px" }}
        />
      </div>
    )}

    {data.emprendedor === "Si" && (
      <>
        <div className="grupos-container">
          <TextInput
            label="Año de Inicio"
            name="ano_inicio_emprendimiento"
            value={data.ano_inicio_emprendimiento || ""}
            onChange={(e) => onChange('ano_inicio_emprendimiento', e.target.value)}
            required
          />
          <TextInput
            label="Mes de Inicio"
            name="mes_inicio_emprendimiento"
            value={data.mes_inicio_emprendimiento || ""}
            onChange={(e) => onChange('mes_inicio_emprendimiento', e.target.value)}
          />
        </div>

        <div className="grupos-container">
          <SelectInput
            label="Sector del Emprendimiento"
            value={data.sector_emprendimiento}
            options={[
              { value: "Tecnología", label: "Tecnología" },
              { value: "Servicios", label: "Servicios" },
              { value: "Comercio", label: "Comercio" },
            ]}
            onChange={(option) => onSelectChange('sector_emprendimiento', option.value)}
            style={{ width: "700px", marginLeft: "32px" }}
          />
        </div>
      </>
    )}
  </div>
);

// Step5WorkExperience.jsx
export const Step5WorkExperience = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Trabajo y Práctica</h3>
    <div className="grupos-container">
      <SelectInput
        label="¿Tiene experiencia laboral?"
        value={data.experiencia_laboral}
        options={[
          { value: "Si", label: "Sí" },
          { value: "No", label: "No" },
        ]}
        onChange={(option) => onSelectChange('experiencia_laboral', option.value)}
        style={{ width: "700px", marginLeft: "32px" }}
      />
    </div>

    {data.experiencia_laboral === "Si" && (
      <>
        <div className="grupos-container">
          <TextInput
            label="Empresa"
            name="empresa"
            value={data.empresa || ""}
            onChange={(e) => onChange('empresa', e.target.value)}
            required
          />
          <TextInput
            label="Cargo"
            name="cargo"
            value={data.cargo || ""}
            onChange={(e) => onChange('cargo', e.target.value)}
          />
        </div>

        <div className="grupos-container">
          <TextInput
            label="Área de Trabajo"
            name="area_trabajo"
            value={data.area_trabajo || ""}
            onChange={(e) => onChange('area_trabajo', e.target.value)}
          />
          <TextInput
            label="Tipo de Cargo"
            name="tipo_cargo"
            value={data.tipo_cargo || ""}
            onChange={(e) => onChange('tipo_cargo', e.target.value)}
          />
        </div>

        <div className="grupos-container">
          <TextInput
            label="Año de Inicio"
            name="ano_inicio_trabajo"
            value={data.ano_inicio_trabajo || ""}
            onChange={(e) => onChange('ano_inicio_trabajo', e.target.value)}
          />
          <TextInput
            label="Mes de Inicio"
            name="mes_inicio_trabajo"
            value={data.mes_inicio_trabajo || ""}
            onChange={(e) => onChange('mes_inicio_trabajo', e.target.value)}
          />
        </div>

        <div className="grupos-container">
          <TextArea
            label="Descripción"
            name="descripcion_trabajo"
            value={data.descripcion_trabajo || ""}
            onChange={(e) => onChange('descripcion_trabajo', e.target.value)}
          />
        </div>
      </>
    )}
  </div>
);

// Step6EducationLevel.jsx
export const Step6EducationLevel = ({ data, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Nivel Educacional</h3>
    <SelectInput
      label="Nivel académico"
      value={data.nivel_academico}
      options={[
        { value: "Basica", label: "Básica" },
        { value: "Media", label: "Media" },
        { value: "Universidad", label: "Universidad" },
        { value: "Postgrado", label: "Postgrado" },
        { value: "Doctorado", label: "Doctorado" },
      ]}
      onChange={(option) => onSelectChange('nivel_academico', option.value)}
      style={{ width: "705px", marginLeft: "32px" }}
    />
    <SelectInput
      label="Estado"
      value={data.estado_educacional}
      options={[
        { value: "Completa", label: "Completa" },
        { value: "Incompleta", label: "Incompleta" },
      ]}
      onChange={(option) => onSelectChange('estado_educacional', option.value)}
      style={{ width: "705px", marginLeft: "32px" }}
    />
  </div>
);

// Step7HigherEducation.jsx
export const Step7HigherEducation = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Educación Superior</h3>
    <div className="grupos-container">
      <TextInput
        label="Institución"
        name="institucion_superior"
        value={data.institucion_superior}
        onChange={(e) => onChange('institucion_superior', e.target.value)}
        required
      />
      <TextInput
        label="Carrera"
        name="carrera"
        value={data.carrera}
        onChange={(e) => onChange('carrera', e.target.value)}
        required
      />
    </div>

    <div className="grupos-container">
      <SelectInput
        label="Carrera afín"
        value={data.carrera_afin}
        options={[
          { value: "Informatica", label: "Informática" },
          { value: "Ingenieria", label: "Ingeniería" },
          { value: "Administracion", label: "Administración" },
        ]}
        onChange={(option) => onSelectChange('carrera_afin', option.value)}
        style={{ width: "322px", marginLeft: "31px" }}
      />
      <SelectInput
        label="Estado"
        value={data.estado_superior}
        options={[
          { value: "Cursando", label: "Cursando" },
          { value: "Egresado", label: "Egresado" },
          { value: "Titulado", label: "Titulado" },
          { value: "Incompleta", label: "Incompleta" },
        ]}
        onChange={(option) => onSelectChange('estado_superior', option.value)}
        style={{ width: "322px", marginLeft: "31px", marginRight: "25px" }}
      />
    </div>

    <div className="grupos-container">
      <SelectInput
        label="Año inicio"
        value={data.ano_inicio_superior}
        options={Array.from({ length: 30 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year.toString(), label: year.toString() };
        })}
        onChange={(option) => onSelectChange('ano_inicio_superior', option.value)}
        style={{ width: "322px", marginLeft: "31px" }}
      />
      <SelectInput
        label="Año término"
        value={data.ano_termino_superior}
        options={Array.from({ length: 30 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year.toString(), label: year.toString() };
        })}
        onChange={(option) => onSelectChange('ano_termino_superior', option.value)}
        style={{ width: "322px", marginLeft: "31px" }}
      />
    </div>
  </div>
);

// Step8BasicEducation.jsx
export const Step8BasicEducation = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Educación básica y media</h3>
    <div className="grupos-container">
      <TextInput
        label="Institución"
        name="institucion_basica_media"
        value={data.institucion_basica_media}
        onChange={(e) => onChange('institucion_basica_media', e.target.value)}
        required
      />
      <SelectInput
        label="Tipo"
        value={data.tipo}
        options={[
          { value: "Educación básica", label: "Educación básica" },
          { value: "Educación media", label: "Educación media" },
          { value: "Educación básica y media", label: "Educación básica y media" },
        ]}
        onChange={(option) => onSelectChange('tipo', option.value)}
        style={{ width: "360px", marginRight: "25px" }}
      />
    </div>

    <div className="grupos-container">
      <SelectInput
        label="País"
        value={data.pais}
        options={[
          { value: "Chile", label: "Chile" },
          { value: "Argentina", label: "Argentina" },
          { value: "Colombia", label: "Colombia" },
          { value: "Peru", label: "Perú" },
        ]}
        onChange={(option) => onSelectChange('pais', option.value)}
        style={{ width: "322px", marginLeft: "31px" }}
      />
      <SelectInput
        label="Ciudad"
        value={data.ciudad_basica_media}
        options={[
          { value: "Santiago", label: "Santiago" },
          { value: "Valparaíso", label: "Valparaíso" },
          { value: "Concepción", label: "Concepción" },
        ]}
        onChange={(option) => onSelectChange('ciudad_basica_media', option.value)}
        style={{ width: "360px", marginLeft: "31px", marginRight: "25px" }}
      />
    </div>

    <div className="grupos-container">
      <SelectInput
        label="Año inicio"
        value={data.ano_inicio_basica_media}
        options={Array.from({ length: 50 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year.toString(), label: year.toString() };
        })}
        onChange={(option) => onSelectChange('ano_inicio_basica_media', option.value)}
        style={{ width: "322px", marginLeft: "31px" }}
      />
      <SelectInput
        label="Año término"
        value={data.ano_termino_basica_media}
        options={Array.from({ length: 50 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year.toString(), label: year.toString() };
        })}
        onChange={(option) => onSelectChange('ano_termino_basica_media', option.value)}
        style={{ width: "360px", marginLeft: "31px", marginRight: "25px" }}
      />
    </div>
  </div>
);

// Step9Languages.jsx
export const Step9Languages = ({ data, onAdd, onRemove }) => {
  const [nuevoIdioma, setNuevoIdioma] = useState({ idioma: "", nivel_idioma: "" });

  const handleAdd = () => {
    if (nuevoIdioma.idioma && nuevoIdioma.nivel_idioma) {
      onAdd(nuevoIdioma);
      setNuevoIdioma({ idioma: "", nivel_idioma: "" });
    } else {
      alert("Por favor, complete ambos campos para agregar el idioma.");
    }
  };

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Idiomas</h3>
      <div className="grupos-container">
        <FormGroup label="Idioma">
          <input
            type="text"
            name="idioma"
            style={{ width: "675px", marginLeft: "31px" }}
            value={nuevoIdioma.idioma}
            onChange={(e) => setNuevoIdioma(prev => ({ ...prev, idioma: e.target.value }))}
          />
        </FormGroup>
      </div>

      <div className="grupos-container">
        <SelectInput
          label="Nivel"
          value={nuevoIdioma.nivel_idioma}
          options={[
            { value: "Básico", label: "Básico" },
            { value: "Intermedio", label: "Intermedio" },
            { value: "Avanzado", label: "Avanzado" },
            { value: "Nativo", label: "Nativo" },
          ]}
          onChange={(option) => setNuevoIdioma(prev => ({ ...prev, nivel_idioma: option.value }))}
          style={{ width: "700px", marginLeft: "31px", marginRight: "25px" }}
        />
      </div>

      <button type="button" onClick={handleAdd}>Agregar Idioma</button>

      {data.length > 0 && (
        <div>
          <h4>Idiomas Agregados:</h4>
          <ul>
            {data.map((idioma, index) => (
              <li key={index}>
                {idioma.idioma} - {idioma.nivel_idioma}
                <button type="button" onClick={() => onRemove(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Step10Skills.jsx
export const Step10Skills = ({ data, categorySkills, onAdd, onRemove }) => {
  const [nuevaHabilidad, setNuevaHabilidad] = useState({
    categoria: "",
    habilidad: "",
    nivel_habilidad: ""
  });

  const handleAdd = () => {
    if (nuevaHabilidad.categoria && nuevaHabilidad.habilidad && nuevaHabilidad.nivel_habilidad) {
      onAdd(nuevaHabilidad);
      setNuevaHabilidad({ categoria: "", habilidad: "", nivel_habilidad: "" });
    } else {
      alert("Por favor, completa todos los campos para agregar la habilidad.");
    }
  };

  return (
    <div className="perfil-freelancer-form-step">
      <h3>Habilidades</h3>
      <div className="grupos-container">
        <SelectInput
          label="Categoría"
          value={nuevaHabilidad.categoria}
          options={categorySkills}
          onChange={(option) => setNuevaHabilidad(prev => ({ ...prev, categoria: option.value }))}
          style={{ width: "700px", marginLeft: "31px", marginRight: "25px" }}
        />
      </div>

      <div className="grupos-container">
        <FormGroup label="Habilidad">
          <input
            type="text"
            name="habilidad"
            style={{ width: "675px", marginLeft: "31px" }}
            value={nuevaHabilidad.habilidad}
            onChange={(e) => setNuevaHabilidad(prev => ({ ...prev, habilidad: e.target.value }))}
          />
        </FormGroup>
      </div>

      <div className="grupos-container">
        <SelectInput
          label="Nivel"
          value={nuevaHabilidad.nivel_habilidad}
          options={[
            { value: "Básico", label: "Básico" },
            { value: "Intermedio", label: "Intermedio" },
            { value: "Avanzado", label: "Avanzado" },
          ]}
          onChange={(option) => setNuevaHabilidad(prev => ({ ...prev, nivel_habilidad: option.value }))}
          style={{ width: "700px", marginLeft: "31px", marginRight: "25px" }}
        />
      </div>

      <button type="button" onClick={handleAdd}>Agregar Habilidad</button>

      {data.length > 0 && (
        <div>
          <h4>Habilidades Agregadas:</h4>
          <ul>
            {data.map((habilidad, index) => (
              <li key={index}>
                {habilidad.categoria} - {habilidad.habilidad} - {habilidad.nivel_habilidad}
                <button type="button" onClick={() => onRemove(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Step11Courses.jsx
export const Step11Courses = ({ data, onChange, onSelectChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Cursos</h3>
    <div className="grupos-container">
      <TextInput
        label="Nombre del Curso"
        name="nombre_curso"
        value={data.nombre_curso}
        onChange={(e) => onChange('nombre_curso', e.target.value)}
        required
      />
      <TextInput
        label="Institución"
        name="institucion_curso"
        value={data.institucion_curso}
        onChange={(e) => onChange('institucion_curso', e.target.value)}
        required
      />
    </div>

    <div className="grupos-container">
      <SelectInput
        label="Año de Inicio"
        value={data.ano_inicio_curso}
        options={Array.from({ length: 20 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { value: year.toString(), label: year.toString() };
        })}
        onChange={(option) => onSelectChange('ano_inicio_curso', option.value)}
        style={{ width: "322px", marginLeft: "31px", marginRight: "25px" }}
      />
      <SelectInput
        label="Mes de Inicio"
        value={data.mes_inicio_curso}
        options={[
          { value: "Enero", label: "Enero" },
          { value: "Febrero", label: "Febrero" },
          { value: "Marzo", label: "Marzo" },
          { value: "Abril", label: "Abril" },
          { value: "Mayo", label: "Mayo" },
          { value: "Junio", label: "Junio" },
          { value: "Julio", label: "Julio" },
          { value: "Agosto", label: "Agosto" },
          { value: "Septiembre", label: "Septiembre" },
          { value: "Octubre", label: "Octubre" },
          { value: "Noviembre", label: "Noviembre" },
          { value: "Diciembre", label: "Diciembre" },
        ]}
        onChange={(option) => onSelectChange('mes_inicio_curso', option.value)}
        style={{ width: "322px", marginLeft: "31px", marginRight: "25px" }}
      />
    </div>
  </div>
);

// Step12Expectations.jsx
export const Step12Expectations = ({ data, onChange }) => (
  <div className="perfil-freelancer-form-step">
    <h3>Pretensiones</h3>
    <div className="grupos-container">
      <TextInput
        label="Disponibilidad"
        name="disponibilidad"
        value={data.disponibilidad}
        onChange={(e) => onChange('disponibilidad', e.target.value)}
        style={{ width: "675px", marginLeft: "31px" }}
        required
      />
    </div>

    <div className="grupos-container">
      <FormGroup label="Renta esperada">
        <input
          type="number"
          name="renta_esperada"
          style={{ width: "675px", marginLeft: "31px" }}
          value={data.renta_esperada}
          onChange={(e) => onChange('renta_esperada', e.target.value)}
          required
        />
      </FormGroup>
    </div>
  </div>
);