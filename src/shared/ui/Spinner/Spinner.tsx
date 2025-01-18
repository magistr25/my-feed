import "./Spinner.scss";

const Spinner = () => (
    <div className="spinner">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="spinner-segment"></div>
        ))}
    </div>
);

export default Spinner;


