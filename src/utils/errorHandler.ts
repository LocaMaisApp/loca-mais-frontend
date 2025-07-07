
export const handleApiError = (error: unknown, defaultMessage: string = "Erro inesperado"): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { 
      response: { 
        data: { message?: string; error?: string } 
      } 
    };
    
    return apiError.response?.data?.message || 
           apiError.response?.data?.error || 
           defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};
