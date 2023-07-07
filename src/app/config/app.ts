//export const BASE_ENDPOINT = 'https://ris.diagnocons.com:4300/api'
export const BASE_ENDPOINT = 'http://localhost:8090/api'

export const VIEWER = 'http://ns1.diagnocons.com/sistema/viewer.php/viewer';
export const ZIP_STUDIES_PATH = 'https://ns1.diagnocons.com:8443/dcm4chee-arc/aets/DCM4CHEE/rs/studies';
export const IMAGE_PATH = BASE_ENDPOINT + '/ris/multimedia/imagen/orden-venta/';
export const PDF_PATH = BASE_ENDPOINT + '/ris/multimedia/documento/orden-venta/';
export const FILES_PATH = BASE_ENDPOINT + '/ris/multimedia/archivo/'
export const WEASIS_VIEWER_PATH= 'https://ns1.diagnocons.com:8443/weasis-pacs-connector/weasis?studyUID='
export const DOWNLOAD_WEASIS_WINDOWS_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0-x86-64.msi';
export const DOWNLOAD_WEASIS_MAC_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0.pkg';
export const RESULTS_URL = 'https://ris.diagnocons.com/ris/resultados/';
export const DIRECCION_CORREO_CONS = 'diagnocons@gmail.com';
export const URL_SUBIR_FOTO = 'https://ris.diagnocons.com/ris/subir-foto-orden/';


export const authorize_uri = 'http://172.17.200.172:8080/auth/realms/rispacs/protocol/openid-connect/auth?';
export const client_id = 'angular';
export const redirect_uri = 'http://localhost:4200/authorized?method=get';
export const scope = 'openid profile';
export const response_type = 'code';
//export const response_mode = 'form_post';
export const code_challenge_method = 'S256';
export const code_challenge = '_PgRBuxzokOwxLP3yq3dq3YzNdtlCi4FIOridBphnPc';
export const code_verifier = 'ciWjgv0br2BiPu0XsEPJ_gTcxsgujo7oa6_xpgXd69g';
export const token_url = 'http://172.17.200.172:8080/auth/realms/rispacs/protocol/openid-connect/token';
export const grant_type = 'authorization_code';
