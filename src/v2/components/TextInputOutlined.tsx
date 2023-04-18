import 'twin.macro';

const TextInputOutlined = (props: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (e: any) => void;
}) => {
  return (
    <div tw="relative w-full">
      <label
        htmlFor={props.id}
        tw="px-2 absolute left-4 -top-2.5 flex gap-1 bg-[#070215]"
      >
        <span tw="text-sm text-[rgba(255, 255, 255, 0.5)]">{props.label}</span>
        {props.required && <span tw="text-base text-[#ED3550]">*</span>}
      </label>
      <input
        id={props.id}
        placeholder={props.placeholder ?? props.label}
        required={props.required ?? false}
        tw="px-6 py-0 w-full h-[71px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
        type={props.type ?? 'text'}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default TextInputOutlined;
