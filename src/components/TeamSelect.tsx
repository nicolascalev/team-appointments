'use client'
import React from 'react'
import { Group, Select, SelectProps, Avatar } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

const iconProps = {
  size: 14,
}

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
  <Group flex="1" gap="xs">
    <Avatar size="sm" radius="xl" color="blue">
      {option.label.charAt(0)}
    </Avatar>
    {option.label}
    {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
  </Group>
)

function TeamSelect() {
  return (
    <Select
      label="Select Team"
      placeholder="Choose a team"
      data={[
        { value: 'team1', label: 'Alpha' },
        { value: 'team2', label: 'Beta' },
        { value: 'team3', label: 'Gamma' },
        { value: 'team4', label: 'Delta' },
      ]}
      renderOption={renderSelectOption}
    />
  )
}

export default TeamSelect