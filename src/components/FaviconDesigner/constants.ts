import {
  CircleNotch,
  Square,
  Triangle,
  Star,
  Heart,
  Polygon,
  TextT,
  Image as ImageIcon,
} from '@phosphor-icons/react'
import { FaviconDesign } from './types'

export const PRESET_SIZES = [16, 32, 48, 64, 128, 256, 512]

export const ELEMENT_TYPES = [
  { value: 'circle', label: 'Circle', icon: CircleNotch },
  { value: 'square', label: 'Square', icon: Square },
  { value: 'triangle', label: 'Triangle', icon: Triangle },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'polygon', label: 'Polygon', icon: Polygon },
  { value: 'text', label: 'Text', icon: TextT },
  { value: 'emoji', label: 'Emoji', icon: ImageIcon },
]

export const DEFAULT_DESIGN: FaviconDesign = {
  id: 'default',
  name: 'My Favicon',
  size: 128,
  backgroundColor: '#7c3aed',
  elements: [
    {
      id: '1',
      type: 'text',
      x: 64,
      y: 64,
      width: 100,
      height: 100,
      color: '#ffffff',
      rotation: 0,
      text: 'CF',
      fontSize: 48,
      fontWeight: 'bold',
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}
