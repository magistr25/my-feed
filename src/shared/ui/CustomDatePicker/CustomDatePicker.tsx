import './CustomDatePicker.scss';
declare global {
    interface HTMLInputElement {}
}
import {FC, forwardRef} from "react";
import DatePicker from "react-datepicker";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import img from "@/assets/images/custom_date_input.png";

interface CustomDatePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
}

interface CustomDateInputProps {
    value?: string;
    onClick?: () => void;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(({ value, onClick }, ref) => {
    return (
        <div className="datepicker">
            <input
                ref={ref}
                type="text"
                value={value}
                onClick={onClick}
                readOnly
                className="datepicker__input"
                placeholder="Выберите дату"
            />
            <button className="datepicker__button" onClick={onClick}>
                <img src={img} alt="Выбрать дату" className="datepicker__icon" />
            </button>
        </div>
    );
});

const CustomDatePicker: FC<CustomDatePickerProps> = ({ selectedDate, onChange }) => {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={onChange}
            dateFormat="dd.MM.yyyy"
            placeholderText="Select a date"
            className="custom-datepicker-input"
            calendarClassName="custom-datepicker-calendar"
            customInput={<CustomDateInput />}
            popperPlacement="bottom-end"
            renderCustomHeader={({
                                     date,
                                     decreaseMonth,
                                     increaseMonth,
                                     prevMonthButtonDisabled,
                                     nextMonthButtonDisabled,
                                     decreaseYear,
                                     increaseYear,
                                     prevYearButtonDisabled,
                                     nextYearButtonDisabled,
                                 }) => {
                const formattedMonth =
                    date.toLocaleString("en-US", { month: "long" }).charAt(0).toUpperCase() +
                    date.toLocaleString("en-US", { month: "long" }).slice(1);

                return (
                    <div className="custom-header">
                        <div className="custom-header-month">
                            <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                className="custom-arrow"
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="custom-header-text">{formattedMonth}</span>
                            <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className="custom-arrow"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                        <div className="custom-header-year">
                            <button
                                onClick={decreaseYear}
                                disabled={prevYearButtonDisabled}
                                className="custom-arrow"
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="custom-header-text">{date.getFullYear()}</span>
                            <button
                                onClick={increaseYear}
                                disabled={nextYearButtonDisabled}
                                className="custom-arrow"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                );
            }}
        />
    );
};

export default CustomDatePicker;
