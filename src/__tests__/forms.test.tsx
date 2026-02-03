import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { FormInput } from '../components/forms/FormInput';
import { FormTextarea } from '../components/forms/FormTextarea';
import { FormSelect } from '../components/forms/FormSelect';

describe('FormInput', () => {
    it('renders with label', () => {
        render(<FormInput label="Test Label" />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders without label', () => {
        render(<FormInput placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<FormInput label="Email" error="Invalid email" />);
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('handles onChange', () => {
        const handleChange = jest.fn();
        render(<FormInput onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('applies custom className', () => {
        render(<FormInput className="custom-input" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-input');
    });

    it('forwards ref', () => {
        const ref = { current: null };
        render(<FormInput ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});

describe('FormTextarea', () => {
    it('renders with label', () => {
        render(<FormTextarea label="Description" />);
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<FormTextarea error="Required field" />);
        expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('respects rows prop', () => {
        render(<FormTextarea rows={5} />);
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '5');
    });

    it('handles onChange', () => {
        const handleChange = jest.fn();
        render(<FormTextarea onChange={handleChange} />);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'test content' } });

        expect(handleChange).toHaveBeenCalled();
    });
});

describe('FormSelect', () => {
    const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
        { value: 'opt3', label: 'Option 3' },
    ];

    it('renders with label', () => {
        render(<FormSelect label="Choose" options={options} />);
        expect(screen.getByLabelText('Choose')).toBeInTheDocument();
    });

    it('renders all options', () => {
        render(<FormSelect options={options} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<FormSelect options={options} error="Please select" />);
        expect(screen.getByText('Please select')).toBeInTheDocument();
    });

    it('handles onChange', () => {
        const handleChange = jest.fn();
        render(<FormSelect options={options} onChange={handleChange} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opt2' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('forwards ref', () => {
        const ref = { current: null };
        render(<FormSelect options={options} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
});
