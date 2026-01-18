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
import copy from '@/data/favicon-designer.json'
import { FaviconDesign } from './types'

export const PRESET_SIZES = [16, 32, 48, 64, 128, 256, 512]

export const ELEMENT_TYPES = [
  { value: 'circle', icon: CircleNotch },
  { value: 'square', icon: Square },
  { value: 'triangle', icon: Triangle },
  { value: 'star', icon: Star },
  { value: 'heart', icon: Heart },
  { value: 'polygon', icon: Polygon },
  { value: 'text', icon: TextT },
  { value: 'emoji', icon: ImageIcon },
]

export const DEFAULT_DESIGN: FaviconDesign = {
  id: 'default',
  name: copy.defaults.designName,
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
      text: copy.defaults.designText,
      fontSize: 48,
      fontWeight: 'bold',
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}
