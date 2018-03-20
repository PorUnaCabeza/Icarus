module.exports = {
  queryPriceSql: `
                  SELECT * 
                       FROM coin_data 
                    WHERE  SYMBOL    = ? 
                       AND unix_time <= ?  
                       ORDER BY unix_time DESC LIMIT 1
                `
};