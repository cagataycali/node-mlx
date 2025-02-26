#ifndef SRC_UTILS_H_
#define SRC_UTILS_H_

#include <numeric>

#include <mlx/mlx.h>
#include <kizunapi.h>

namespace mx = mlx::core;

using IntOrVector = std::variant<std::monostate, int, std::vector<int>>;
using ScalarOrArray = std::variant<bool, float, mx::array>;

// Convert a int or vector into vector.
inline std::vector<int> ToIntVector(std::variant<int, std::vector<int>> shape) {
  if (auto i = std::get_if<int>(&shape); i)
    return {*i};
  return std::move(std::get<std::vector<int>>(shape));
}

// Read args into a vector of types.
template<typename T>
bool ReadArgs(ki::Arguments* args, std::vector<T>* results) {
  while (args->RemainingsLength() > 0) {
    std::optional<T> a = args->GetNext<T>();
    if (!a) {
      args->ThrowError(ki::Type<T>::name);
      return false;
    }
    results->push_back(std::move(*a));
  }
  return true;
}

// Convert the type to string.
template<typename T>
std::string ToString(const T* value) {
  std::ostringstream ss;
  ss << *value;
  return ss.str();
}

// Define the toString method for type's prototype.
template<typename T>
void DefineToString(napi_env env, napi_value prototype) {
  auto symbol = ki::SymbolFor("nodejs.util.inspect.custom");
  ki::Set(env, prototype,
          "toString", ki::MemberFunction(&ToString<T>),
          symbol, ki::MemberFunction(&ToString<T>));
}

// Get axis arg from js value.
std::vector<int> GetReduceAxes(IntOrVector value, int dims);

// Convert a ScalarOrArray arg to array.
mx::array ToArray(ScalarOrArray value,
                  std::optional<mx::Dtype> dtype = std::nullopt);

#endif  // SRC_UTILS_H_
