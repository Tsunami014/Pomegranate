let Schema = {
  apps | Array String,
  ip | String,
} in

(import "lib.ncl").merge_all modules | Schema
