export const BASE_ENDPOINT = 'https://ris.diagnocons.com:4300/api'
//export const BASE_ENDPOINT = 'http://localhost:8090/api'

export const VIEWER = 'http://ns1.diagnocons.com/sistema/viewer.php/viewer';
export const ZIP_STUDIES_PATH = 'https://ns1.diagnocons.com:8443/dcm4chee-arc/aets/DCM4CHEE/rs/studies';
export const JPG_STUDIES_PATH = 'https://ris.diagnocons.com:8443/dcm4chee-arc/aets/DCM4CHEE/rs/studies/{studyInstanceUid}/series/{seriesNumber}/instances/{}/thumbnail';
//Series generalmente es el 1 en rx, en tac es el topograma, instances es 1 o 2 en rx, en tac son muchas jaja
//https://ris.diagnocons.com:8443/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.2.410.200067.100.1.202105271113050290.29133/series/1.2.410.200067.100.2.202105271113050290.32740.1/instances/1/thumbnail

export const IMAGE_PATH = BASE_ENDPOINT + '/ris/multimedia/imagen/orden-venta/';
export const PDF_PATH = BASE_ENDPOINT + '/ris/multimedia/documento/orden-venta/';
export const FILES_PATH = BASE_ENDPOINT + '/ris/multimedia/archivo/'
export const WEASIS_VIEWER_PATH= 'https://ns1.diagnocons.com:8443/weasis-pacs-connector/weasis?studyUID='
export const DOWNLOAD_WEASIS_WINDOWS_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0-x86-64.msi';
export const DOWNLOAD_WEASIS_MAC_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0.pkg';
export const RESULTS_URL = 'https://ris.diagnocons.com/ris/resultados/';
export const DIRECCION_CORREO_CONS = 'diagnocons@gmail.com';
export const URL_SUBIR_FOTO = 'https://ris.diagnocons.com/ris/subir-foto-orden/';


const BASE_SERVER_ADDRESS = 'https://auth.diagnocons.com/realms/diagnocons/protocol/openid-connect/';
//const BASE_SERVER_ADDRESS = 'http://localhost:8080/realms/diagnocons/protocol/openid-connect/';


export const authorize_uri = BASE_SERVER_ADDRESS + 'auth?';
export const logour_uri =  BASE_SERVER_ADDRESS + 'logout?';

//export const post_logout_redirect_uri = 'http://localhost:4200/logout'; //Este
export const post_logout_redirect_uri = 'https://ris.diagnocons.com/ris/logout'

export const client_id = 'rispacs';

//export const redirect_uri = 'http://localhost:4200/authorized?method=get'; //Este
export const redirect_uri = 'https://ris.diagnocons.com/ris/authorized?method=get'; //Este

export const scope = 'openid profile';
export const response_type = 'code';
export const code_challenge_method = 'S256';
export const token_url = BASE_SERVER_ADDRESS + 'token';
export const grant_type = 'authorization_code';
export const grant_type_refresh = 'refresh_token'
export const secret_pkce = 'secret';
