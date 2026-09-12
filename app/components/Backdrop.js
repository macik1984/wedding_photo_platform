/**
 * Farebny podklad, cez ktory presvitaju sklenene plochy. Bez neho by sklo
 * nemalo co rozostrovat a vyzeralo by len ako sedy panel.
 */
export default function Backdrop() {
  return (
    <div className="ui-bg" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
