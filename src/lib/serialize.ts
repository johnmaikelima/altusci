/**
 * Converte um documento MongoDB em um objeto JavaScript simples
 * Isso é necessário porque o MongoDB adiciona métodos e propriedades extras
 * que não são serializáveis para JSON puro
 */
export function serializeDocument<T>(doc: T): T {
  if (!doc) return doc;
  
  // Se for um array, serializa cada item
  if (Array.isArray(doc)) {
    return doc.map(item => serializeDocument(item)) as unknown as T;
  }
  
  // Se for um objeto MongoDB com toJSON, usa o método toJSON
  if (typeof doc === 'object' && doc !== null && 'toJSON' in doc) {
    return serializeDocument((doc as any).toJSON());
  }
  
  // Se for um objeto simples, serializa cada propriedade
  if (typeof doc === 'object' && doc !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(doc)) {
      // Converte _id de Buffer para string se necessário
      if (key === '_id' && value && typeof value === 'object' && 'buffer' in value) {
        result[key] = (value as any).toString('hex');
      } else {
        result[key] = serializeDocument(value);
      }
    }
    return result as T;
  }
  
  // Para outros tipos de dados, retorna como estão
  return doc;
}
