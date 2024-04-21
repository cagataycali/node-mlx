#ifndef SRC_ARRAY_H_
#define SRC_ARRAY_H_

#include "src/utils.h"

namespace ki {

template<>
struct Type<mx::Dtype> {
  static constexpr const char* name = "Dtype";
  static void Define(napi_env env,
                     napi_value constructor,
                     napi_value prototype);
  static napi_status ToNode(napi_env env,
                            const mx::Dtype& value,
                            napi_value* result);
  static std::optional<mx::Dtype> FromNode(napi_env env,
                                           napi_value value);
};

template<>
struct Type<mx::Dtype::Category> {
  static constexpr const char* name = "DtypeCategory";
  static napi_status ToNode(napi_env env,
                            mx::Dtype::Category value,
                            napi_value* result);
  static std::optional<mx::Dtype::Category> FromNode(napi_env env,
                                                     napi_value value);
};

template<>
struct Type<mx::array> : public AllowPassByValue<mx::array> {
  static constexpr const char* name = "array";
  static constexpr bool allow_function_call = true;
  static mx::array* Constructor(napi_env env,
                                napi_value value,
                                std::optional<mx::Dtype> dtype);
  static void Define(napi_env env,
                     napi_value constructor,
                     napi_value prototype);
  static std::optional<mx::array> FromNode(napi_env env,
                                           napi_value value);
};

}  // namespace ki

#endif  // SRC_ARRAY_H_
