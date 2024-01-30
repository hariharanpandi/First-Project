// langConstants.ts

export const CLIENT_MESSAGES = {
    en: {
        PORT_LISTEN: "Server is now running on port ",
        USER_CREATE: "User has been successfully created.",
        USER_UPDATE: "User has been successfully updated.",
        EMAIL_VERIFICATION: "Email verification successful!",
        LOGIN_SUCCESSFUL: "You're now securely logged in."
    },
    es: {
        PORT_LISTEN: "El servidor se está ejecutando en el puerto ",
        USER_CREATE: "El usuario se ha creado correctamente.",
        USER_UPDATE: "El usuario se ha actualizado correctamente.",
        EMAIL_VERIFICATION: "Verificación de correo electrónico exitosa.",
        LOGIN_SUCCESSFUL: "Ahora has iniciado sesión de forma segura."
    },
    ar: {
        PORT_LISTEN: "الخادم يعمل الآن على المنفذ ",
        USER_CREATE: "تم إنشاء المستخدم بنجاح.",
        USER_UPDATE: "تم تحديث المستخدم بنجاح.",
        EMAIL_VERIFICATION: "تحقق البريد الإلكتروني بنجاح!",
        LOGIN_SUCCESSFUL: "أنت الآن مسجل الدخول بأمان."
    }
};

export const CLIENT_ERROR_MESSAGES = {
    en: {
        INTERNAL_SERVER_ERROR: "Internal Server Error",
        INVALID_X_VERIFY_TOKEN: "Invalid verification token",
        EMPTY_TOKEN: "Authentication token is missing. Please provide a valid token.",
        UNAUTHORIZED_USER: "Access denied. You are not authorized to perform this action.",
        INVALID_TOKEN: "Invalid token. Please provide a valid authentication token.",
        INVALID_EMAIL_OR_PASSWORD: "Invalid email or password. Please check your credentials and try again.",
        EXISTING_USER: "This email is already registered. Please choose a different email or sign in.",
        EMAIL_VERIFICATION_FAILED: "Email verification failed.",
        ALREADY_VERIFIED: "Your account has already been verified",
        USER_NOT_FOUND: "User not found. Please verify the entered Id or contact support for assistance.",
        EMAIL_VERIFY_PENDING: "Your email verification is pending. Please check your inbox for instructions.",
        INVALID_MOBILE: "Invalid phone number. Please check your phone number and try again.",
        URL_NOT_FOUND: "The requested resource could not be found on the server."
    },
    es: {
        INTERNAL_SERVER_ERROR: "Error interno del servidor",
        INVALID_X_VERIFY_TOKEN: "Token de verificación no válido",
        EMPTY_TOKEN: "Falta el token de autenticación. Proporcione un token válido.",
        UNAUTHORIZED_USER: "Acceso denegado. No tiene autorización para realizar esta acción.",
        INVALID_TOKEN: "Token no válido. Proporcione un token de autenticación válido.",
        INVALID_EMAIL_OR_PASSWORD: "Correo electrónico o contraseña no válidos. Verifique sus credenciales e inténtelo de nuevo.",
        EXISTING_USER: "Este correo electrónico ya está registrado. Elija un correo electrónico diferente o inicie sesión.",
        EMAIL_VERIFICATION_FAILED: "Fallo en la verificación del correo electrónico.",
        ALREADY_VERIFIED: "Su cuenta ya ha sido verificada",
        USER_NOT_FOUND: "Usuario no encontrado. Verifique el Id ingresado o póngase en contacto con el soporte para obtener ayuda.",
        EMAIL_VERIFY_PENDING: "Su verificación de correo electrónico está pendiente. Consulte su bandeja de entrada para obtener instrucciones.",
        INVALID_MOBILE: "Número de teléfono no válido. Verifique su número de teléfono e inténtelo de nuevo.",
        URL_NOT_FOUND: "No se pudo encontrar el recurso solicitado en el servidor."
    },
    ar: {
        INTERNAL_SERVER_ERROR: "خطأ في الخادم الداخلي",
        INVALID_X_VERIFY_TOKEN: "رمز التحقق غير صالح",
        EMPTY_TOKEN: "نقص رمز المصادقة. يرجى توفير رمز صالح.",
        UNAUTHORIZED_USER: "تم رفض الوصول. ليس لديك إذن لأداء هذا الإجراء.",
        INVALID_TOKEN: "رمز غير صالح. يرجى توفير رمز مصادقة صالح.",
        INVALID_EMAIL_OR_PASSWORD: "البريد الإلكتروني أو كلمة المرور غير صالحين. يرجى التحقق من بيانات الاعتماد الخاصة بك والمحاولة مرة أخرى.",
        EXISTING_USER: "هذا البريد الإلكتروني مسجل بالفعل. يرجى اختيار بريد إلكتروني مختلف أو تسجيل الدخول.",
        EMAIL_VERIFICATION_FAILED: "فشل التحقق من البريد الإلكتروني.",
        ALREADY_VERIFIED: "تم التحقق من حسابك بالفعل",
        USER_NOT_FOUND: "المستخدم غير موجود. يرجى التحقق من الهوية المدخلة أو الاتصال بالدعم للحصول على المساعدة.",
        EMAIL_VERIFY_PENDING: "تحقق البريد الإلكتروني الخاص بك قيد الانتظار. يرجى التحقق من صندوق الوارد الخاص بك للحصول على التعليمات.",
        INVALID_MOBILE: "رقم الهاتف غير صالح. يرجى التحقق من رقم هاتفك والمحاولة مرة أخرى.",
        URL_NOT_FOUND: "تعذر العثور على المورد المطلوب على الخادم."
    }
};
