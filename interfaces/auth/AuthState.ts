export interface AuthState {
  apellidos:                   string;
  capacitador:                 number;
  cargo_id:                    null;
  cedula:                      string;
  change_password:             number;
  cli_ins_codigo:              null;
  cod_usuario:                 string;
  created_at:                  Date;
  curso:                       string;
  date_created:                Date;
  email:                       string;
  estado_idEstado:             number;
  estado_institucion_temporal: string;
  fecha_change_password:       null;
  fecha_nacimiento:            Date;
  foto_user:                   string;
  grupo:                       Grupo;
  id_group:                    number;
  idcreadorusuario:            null;
  idusuario:                   number;
  iniciales:                   null;
  institucion:                 Institucion;
  institucion_idInstitucion:   number;
  institucion_temporal_id:     null;
  modificado_por:              null;
  nacionalidad:                string;
  name_usuario:                string;
  nombres:                     string;
  p_ingreso:                   number;
  paralelo:                    string;
  password_status:             string;
  periodo_actualizacion:       number;
  recurso_externo:             string;
  retirado:                    null;
  seccion:                     null;
  session_id:                  null;
  sexo:                        null;
  telefono:                    string;
  update_datos:                null;
  updated_at:                  Date;
}

export interface Grupo {
  busquedaUsuarios: null;
  created_at:       Date;
  deskripsi:        string;
  id:               number;
  level:            string;
  permiso_rol:      null;
  updated_at:       null;
  user_created:     null;
  user_edited:      null;
}

export interface Institucion {
  idInstitucion:     number;
  nombreInstitucion: string;
}
