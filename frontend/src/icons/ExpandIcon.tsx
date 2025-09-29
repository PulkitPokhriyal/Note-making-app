import { type Iconprops, iconSizeVariants } from "./iconstyle";

export const ExpandIcon = (props: Iconprops) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className={`${iconSizeVariants[props.size]} cursor-pointer`}
        onClick={props.onClick}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
};
