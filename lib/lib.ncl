{
  # Deep-merges `right` into `left`. Records merge recursively;
  # arrays are concatenated instead of requiring equality;
  # anything else, `right`'s value wins.
  deep_merge = fun left right =>
    right
    |> std.record.to_array
    |> std.array.fold_left
      (fun acc { field, value } =>
        if std.record.has_field field acc then
          let existing = acc."%{field}" in
          let combined =
            if std.is_array existing && std.is_array value then
              std.array.concat existing value
            else if std.is_record existing && std.is_record value then
              deep_merge existing value
            else
              value
          in
          (std.record.remove field acc) & { "%{field}" = combined }
        else
          acc & { "%{field}" = value }
      )
      left,

  # Folds deep_merge across an arbitrary number of records/modules.
  merge_all = fun records =>
    std.array.fold_left deep_merge {} records,
}
