// will only work for react-hook-form lib


export default function ValidationError({ errors }) {
  let content = [];
  for (let key in errors) {
    content.push(<li className="text-red-700">{errors[key].message}</li>);
  }
  return content.length ? <ul className="border-2 border-rose-500 bg-gray-900 p-5">{content}</ul>: '';
}