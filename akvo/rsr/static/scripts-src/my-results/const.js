/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */


// TODO: several of these constants should be derived from the RSR settings
export const
    API_LIMIT = 100,
    // From rsr.models.indicator.IndicatorPeriodData
    ROLE_ME_MANAGER = 'ROLE_ME_MANAGER',
    ROLE_PROJECT_EDITOR = 'ROLE_PROJECT_EDITOR',

    UPDATE_STATUS_NEW = 'N',
    UPDATE_STATUS_DRAFT = 'D',
    UPDATE_STATUS_PENDING = 'P',
    UPDATE_STATUS_REVISION = 'R',
    UPDATE_STATUS_APPROVED = 'A',

    UPDATE_ACTION_DELETE = 'deleteUpdate',
    UPDATE_ACTION_SAVE = 'saveUpdate',
    UPDATE_ACTION_SUBMIT = 'submitUpdate',
    UPDATE_ACTION_RETURN = 'returnUpdate',
    UPDATE_ACTION_APPROVE = 'approveUpdate',
    UPDATE_ACTION_PREVIEW = 'previewUpdate',
    UPDATE_ACTION_EDIT = 'editUpdate',

    // matrix determining what buttons to show depending on user role and update state
    UPDATE_BUTTONS = {
        [ROLE_ME_MANAGER]: {
            [UPDATE_STATUS_NEW]: [UPDATE_ACTION_SAVE, UPDATE_ACTION_APPROVE,],
            [UPDATE_STATUS_DRAFT]: [
                UPDATE_ACTION_DELETE, UPDATE_ACTION_SAVE, UPDATE_ACTION_APPROVE,
            ],
            [UPDATE_STATUS_PENDING]: [
                UPDATE_ACTION_SAVE, UPDATE_ACTION_RETURN, UPDATE_ACTION_APPROVE,
            ],
            [UPDATE_STATUS_REVISION]: [
                UPDATE_ACTION_DELETE, UPDATE_ACTION_SAVE, UPDATE_ACTION_APPROVE,
            ],
            [UPDATE_STATUS_APPROVED]: [UPDATE_ACTION_DELETE, UPDATE_ACTION_APPROVE,],
        },
        [ROLE_PROJECT_EDITOR]: {
            [UPDATE_STATUS_NEW]: [UPDATE_ACTION_SAVE, UPDATE_ACTION_SUBMIT,],
            [UPDATE_STATUS_DRAFT]: [
                UPDATE_ACTION_DELETE, UPDATE_ACTION_SAVE, UPDATE_ACTION_SUBMIT,
            ],
            [UPDATE_STATUS_PENDING]: [],
            [UPDATE_STATUS_REVISION]: [
                UPDATE_ACTION_DELETE, UPDATE_ACTION_SAVE, UPDATE_ACTION_SUBMIT,
            ],
            [UPDATE_STATUS_APPROVED]: [],
        }
    },

    OBJECTS_APP = 'app',
    OBJECTS_RESULTS = 'results',
    OBJECTS_INDICATORS = 'indicators',
    OBJECTS_DIMENSIONS = 'dimensions',
    OBJECTS_PERIODS = 'periods',
    OBJECTS_UPDATES = 'updates',
    OBJECTS_COMMENTS = 'comments',
    OBJECTS_DISAGGREGATIONS = 'disaggregations',
    OBJECTS_USER = 'user',
    OBJECTS_REPORTS = 'reports',

    // List of the models used in the accordion, in hierarchy order
    RESULTS_MODELS_LIST = [
        OBJECTS_RESULTS, OBJECTS_INDICATORS, OBJECTS_PERIODS, OBJECTS_UPDATES, OBJECTS_COMMENTS
    ],

    // Lookup of slicing index for models when slicing RESULTS_MODELS_LIST
    MODEL_INDEX = {
        [OBJECTS_RESULTS]: 0,
        [OBJECTS_INDICATORS]: 1,
        [OBJECTS_PERIODS]: 2,
        [OBJECTS_UPDATES]: 3,
        [OBJECTS_COMMENTS]: 4,
    },

    // Lookup of the parent FK field name on a model
    PARENT_FIELD = {
        [OBJECTS_RESULTS]: null,
        [OBJECTS_INDICATORS]: 'result',
        [OBJECTS_DIMENSIONS]: 'indicator',
        [OBJECTS_PERIODS]: 'indicator',
        [OBJECTS_UPDATES]: 'period',
        [OBJECTS_DISAGGREGATIONS]: 'update',
        [OBJECTS_COMMENTS]: 'data',
    },

    // Lookup of the child model for a model
    CHILD_OBJECTS = {
        [OBJECTS_RESULTS]: OBJECTS_INDICATORS,
        [OBJECTS_INDICATORS]: OBJECTS_PERIODS,
        [OBJECTS_DIMENSIONS]: null,
        [OBJECTS_PERIODS]: OBJECTS_UPDATES,
        [OBJECTS_UPDATES]: OBJECTS_COMMENTS,
        [OBJECTS_COMMENTS]: null,
        [OBJECTS_DISAGGREGATIONS]: null,
    },

    // List of all models fetched from the RSR API
    ALL_MODELS_LIST = [
        OBJECTS_DIMENSIONS, OBJECTS_DISAGGREGATIONS, OBJECTS_USER, OBJECTS_REPORTS
    ].concat(RESULTS_MODELS_LIST),

    // UI state
    SELECTED_PERIODS = 'selectedPeriods',
    UPDATE_FORMS = 'updateForms',
    UPDATE_FORM_DISPLAY = 'updateFormDisplay', // boolean, keeping track if the update form is open
    REPORT_FORM_DISPLAY = 'reportFormDisplay', // boolean, keeping track if the narrative report form is open

    // Alerts
    INITIALIZE_ALERT = 'INITIALIZE_ALERT',
    CREATE_ALERT = 'CREATE_ALERT',
    DISMISS_ALERT = 'DISMISS_ALERT',
    DISMISS_ALL_ALERTS = 'DISMISS_ALL_ALERTS',
    DESTROY_ALL_ALERTS = 'DESTROY_ALL_ALERTS',
    DESTROY_ALERT = 'DESTROY_ALERT',

    // modelsReducer
    FETCH_MODEL_START = "FETCH_MODEL_START",
    FETCH_MODEL_FULFILLED = "FETCH_MODEL_FULFILLED",
    FETCH_MODEL_REJECTED = "FETCH_MODEL_REJECTED",

    UPDATE_MODEL_START = "UPDATE_MODEL_START",
    UPDATE_MODEL_FULFILLED = "UPDATE_MODEL_FULFILLED",
    UPDATE_MODEL_REJECTED = "UPDATE_MODEL_REJECTED",

    DELETE_FROM_MODEL = "DELETE_FROM_MODEL",
    UPDATE_MODEL_DELETE_FULFILLED = "UPDATE_MODEL_DELETE_FULFILLED",

    // collapseReducer
    KEY_SET_ACTIVE = "KEY_SET_ACTIVE",
    KEY_ADD_TO_ACTIVE = "KEY_ADD_TO_ACTIVE",
    KEYS_RESET = "KEYS_RESET",
    KEYS_COPY_TO_VISIBLE = "KEYS_COPY_TO_VISIBLE",

    // pageReducer
    PAGE_SET_DATA = "PAGE_SET_DATA",

    // uiReducer
    UI_ID_RESET = "UI_ID_RESET",
    UI_ID_TOGGLE = "UI_ID_TOGGLE",
    UI_ID_TRUE = "UI_ID_TRUE",
    UI_ID_FALSE = "UI_ID_FALSE",
    // boolean controlling a single UI element, used to show the update form
    UI_FLAG_TOGGLE = "UI_FLAG_TOGGLE",
    UI_FLAG_TRUE = "UI_FLAG_TRUE",
    UI_FLAG_FALSE = "UI_FLAG_FALSE",
    UI_HIDE = "UI_HIDE",
    ALL_MODELS_FETCHED = "ALL_MODELS_FETCHED",
    SET_PERIOD_DATES = "SET_PERIOD_DATES",
    UI_FILTER_BUTTON_ACTIVE = "UI_FILTER_BUTTON_ACTIVE",

    // filter buttons (including the period select box)
    FILTER_NEED_REPORTING = "needReporting",
    FILTER_SHOW_PENDING = "pending",
    FILTER_SHOW_APPROVED = "approved",
    FILTER_BULK_SELECT = "FILTER_BULK_SELECT",

    // Indicator types
    INDICATOR_QUANTATIVE = 1,
    INDICATOR_QUALITATIVE = 2,

    // Indicator measures (Includes the proposed qualitative measure type)
    MEASURE_UNIT = "1",
    MEASURE_PERCENTAGE = "2",
    MEASURE_QUALITATIVE = "3",

    // IUCN organisation ID. Used to determine if we hide some UI elements
    IUCN_ORG_ID = 3257
;
