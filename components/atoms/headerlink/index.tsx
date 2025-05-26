export default function HeaderLink({ href, label } : HeaderLinkProps) {
  return (
    /* "Adapted" from https://stackoverflow.com/a/73043524
    * Starting with a 2px high white gradient that's 0% wide
    * On hover, animating its width from 0% to 100%
    * Because it's positioned at the bottom, it looks like an underline ()
    * The gradient gives it a solid white color
    * The transition makes it animate smoothly from left to right
    * (this is insanity)
    */
    <>
      <a
        href={href}
        className="group text-white transition-all duration-300 ease-in-out"
      >
        <span className="rounded bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
          {label}
        </span>
      </a></>
  )
}