interface IconOneShotModeProps {
    mode?: "layer" | "modifier";
}

const IconOneShotMode = ({ mode = "layer" }: IconOneShotModeProps) => (
    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.481 8.5C14.4936 8.33497 14.5 8.16823 14.5 8C14.5 6.2934 13.8416 4.73944 12.766 3.58006C11.5796 2.30131 9.88297 1.5 8 1.5C6.11703 1.5 4.42045 2.30131 3.23403 3.58006C2.15836 4.73944 1.5 6.2934 1.5 8C1.5 9.7066 2.15836 11.2606 3.23403 12.4199C4.42045 13.6987 6.11703 14.5 8 14.5C8.17089 14.5 8.34024 14.4934 8.50781 14.4804L8.5 8.5H14.481ZM6.47611 7.5C6.33211 6.00074 5.54731 4.68907 4.40012 3.84163C5.247 3.10774 6.31961 2.6287 7.5 2.5224V7.5H6.47611ZM8.5 7.5V2.5224C9.68039 2.6287 10.753 3.10774 11.5999 3.84163C10.4527 4.68908 9.66789 6.00074 9.52389 7.5H8.5ZM10.5297 7.5C10.6748 6.28667 11.3412 5.2331 12.2999 4.57023C12.9537 5.38864 13.3783 6.39716 13.4776 7.5H10.5297ZM7.5 8.5V13.4776C6.31961 13.3713 5.247 12.8923 4.40012 12.1584C5.54731 11.3109 6.33211 9.99926 6.47611 8.5H7.5ZM5.47032 8.5C5.32524 9.71333 4.6588 10.7669 3.70009 11.4298C3.04633 10.6114 2.6217 9.60284 2.5224 8.5H5.47032ZM5.47032 7.5H2.5224C2.6217 6.39716 3.04633 5.38864 3.70009 4.57023C4.6588 5.2331 5.32524 6.28666 5.47032 7.5Z"
            fill="currentColor"
        />
        {mode === "layer" ? (
            <path
                d="M11.132 10.2C11.132 10.1094 11.172 10.064 11.252 10.064H12.204C12.2787 10.064 12.316 10.1067 12.316 10.192V15.024C12.316 15.088 12.3453 15.12 12.404 15.12H15.028C15.1133 15.12 15.156 15.1574 15.156 15.232V15.88C15.156 15.912 15.1453 15.9414 15.124 15.968C15.1027 15.9894 15.068 16 15.02 16H11.284C11.2253 16 11.1853 15.9894 11.164 15.968C11.1427 15.9414 11.132 15.904 11.132 15.856V10.2Z"
                fill="currentColor"
            />
        ) : (
            <path
                d="M11.284 16C11.1827 16 11.132 15.9467 11.132 15.84V10.2C11.132 10.1094 11.1747 10.064 11.26 10.064H12.612C12.6653 10.064 12.7027 10.072 12.724 10.088C12.7507 10.0987 12.7693 10.128 12.78 10.176L14.188 13.952C14.204 13.9947 14.2227 14.016 14.244 14.016C14.2653 14.0107 14.284 13.9867 14.3 13.944L15.668 10.216C15.7 10.1147 15.7533 10.064 15.828 10.064H17.228C17.3027 10.064 17.34 10.1067 17.34 10.192V15.832C17.34 15.944 17.2813 16 17.164 16H16.308C16.2547 16 16.2147 15.9894 16.188 15.968C16.1667 15.9414 16.156 15.904 16.156 15.856V11.672C16.156 11.64 16.148 11.6267 16.132 11.632C16.116 11.632 16.1027 11.648 16.092 11.68L14.572 15.88C14.5453 15.96 14.492 16 14.412 16H13.844C13.7533 16 13.6947 15.96 13.668 15.88L12.164 11.728C12.1533 11.6907 12.14 11.6747 12.124 11.68C12.108 11.68 12.1 11.6987 12.1 11.736V15.872C12.1 15.92 12.092 15.9547 12.076 15.976C12.06 15.992 12.0227 16 11.964 16H11.284Z"
                fill="currentColor"
            />
        )}
    </svg>
);

export default IconOneShotMode;
