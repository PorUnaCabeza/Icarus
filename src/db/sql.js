module.exports = {
  queryPriceSql: `
                  SELECT * 
                       FROM coin_data 
                    WHERE  SYMBOL    = ? 
                       AND unix_time <= ?  
                       ORDER BY unix_time DESC LIMIT 1
                `,
  updateUser: `
                 INSERT INTO user (
                               id
                              ,name
                              ,create_time
                            )
                            VALUES ?
                 ON DUPLICATE KEY UPDATE update_time = now()
                `,
  saveMessage: `
          INSERT INTO message (
                        id
                       ,user_id
                       ,user_name
                       ,message
                       ,create_time 
                    )
                    VALUES (
                      ?
                     ,?
                     ,?
                     ,?
                     ,?
                    ) 
  `
};
