import { Link } from "react-router-dom";

export default function Footer(){
    return (
        <>
        <footer>
    <div class="f-info">
        <div class="f-info-socials">
            <i class="fa-brands fa-square-facebook"></i>
            <i class="fa-brands fa-square-instagram"></i>
            <i class="fa-brands fa-linkedin"></i>
        </div>
        <div>&copy; BookNest Private Limited</div>
        <div class="f-info-links">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
        </div>
    </div>
</footer>
        </>
    )
}