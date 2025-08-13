export interface CustomField {
  conditional: 'on' | 'off'
  hide_on_summary: 'on' | 'off'
  id: string
  label: string
  options: string
  placeholder: string
  required: 'on' | 'off'
  type: 'text' | 'select'
  visibility: 'admin_agent' | 'public'
  width: 'os-col-12' | 'os-col-6'
  conditions: {
    [key: string]: CustomFieldCondition
  }
}

interface CustomFieldCondition {
  operator: 'equal' | 'not_equal'
  property: string
  value: string
}
