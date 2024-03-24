


export default SelectOption({props}) {

  return (
    <option value={props.id} {props.categoryParent === props.id ? selected}>{props.name}</option>
  );
}