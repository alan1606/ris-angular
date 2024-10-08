import { environment } from "@envs/environment";

export const BASE_SITE=environment.BASE_SITE

export const BASE_ENDPOINT = environment.BASE_ENDPOINT

export const post_logout_redirect_uri = environment.post_logout_redirect_uri

export const redirect_uri = environment.redirect_uri

export const turneroSocket =  environment.turneroSocket

export const chatSocket = environment.chatSocket

export const VIEWER = 'https://ris.diagnocons.com/viewer?StudyInstanceUIDs=';
export const ZIP_STUDIES_PATH = 'https://ris.diagnocons.com/dcm4chee-arc/aets/DCM4CHEE/rs/studies';
export const JPG_STUDIES_PATH = 'https://ris.diagnocons.com/dcm4chee-arc/aets/DCM4CHEE/rs/studies/{studyInstanceUid}/series/{seriesNumber}/instances/{}/thumbnail';

export const IMAGE_PATH = BASE_ENDPOINT + '/ris/multimedia/imagen/orden-venta/';
export const PDF_PATH = BASE_ENDPOINT + '/ris/multimedia/documento/orden-venta/';
export const FILES_PATH = BASE_ENDPOINT + '/ris/multimedia/archivo/'
export const WEASIS_VIEWER_PATH= 'https://ris.diagnocons.com/weasis-pacs-connector/weasis?studyUID='
export const DOWNLOAD_WEASIS_WINDOWS_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0-x86-64.msi';
export const DOWNLOAD_WEASIS_MAC_LINK = 'https://github.com/nroduit/Weasis/releases/download/v3.7.0/Weasis-3.7.0.pkg';
export const RESULTS_URL = 'https://ris.diagnocons.com/ris/resultados/';
export const DIRECCION_CORREO_CONS = 'diagnocons@gmail.com';
export const URL_SUBIR_FOTO = 'https://ris.diagnocons.com/ris/recepcion/subir-foto-orden/';

const BASE_SERVER_ADDRESS = 'https://auth.diagnocons.com/realms/diagnocons/protocol/openid-connect/';

export const authorize_uri = BASE_SERVER_ADDRESS + 'auth?';
export const logour_uri =  BASE_SERVER_ADDRESS + 'logout?';
export const client_id = 'rispacs';

export const scope = 'openid profile';
export const response_type = 'code';
export const code_challenge_method = 'S256';
export const token_url = BASE_SERVER_ADDRESS + 'token';
export const grant_type = 'authorization_code';
export const grant_type_refresh = 'refresh_token'
export const secret_pkce = 'secret';
