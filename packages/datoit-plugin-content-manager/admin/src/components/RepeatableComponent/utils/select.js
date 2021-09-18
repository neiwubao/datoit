import { useContentManagerEditViewDataManager } from 'datoit-helper-plugin';

function useSelect() {
  const { addRepeatableComponentToField, formErrors } = useContentManagerEditViewDataManager();

  return {
    addRepeatableComponentToField,
    formErrors,
  };
}

export default useSelect;
