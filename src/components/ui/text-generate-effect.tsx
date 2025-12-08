'use client'
import * as React from 'react'
import { motion, stagger, useAnimate } from 'motion/react'
import { BackgroundGradient } from './background-gradient'

type WordItem = {
  text: string
  className?: string
  style?: React.CSSProperties
  isSpan: boolean
  keepTogether?: boolean // For whitespace-nowrap spans
}

type TextGenerateEffectProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  children: React.ReactNode
  filter?: boolean
  duration?: number
  staggerDelay?: number
}

// Helper function to extract text and preserve span elements
function extractWords(children: React.ReactNode): WordItem[] {
  const words: WordItem[] = []

  const processNode = (node: React.ReactNode): void => {
    if (typeof node === 'string' || typeof node === 'number') {
      // Split text by spaces and add each word
      const text = String(node)
      const textWords = text.split(/(\s+)/)
      textWords.forEach((word) => {
        if (word.trim()) {
          words.push({ text: word, isSpan: false })
        } else if (word) {
          // Preserve spaces
          words.push({ text: word, isSpan: false })
        }
      })
    } else if (React.isValidElement(node)) {
      const elementProps = node.props as {
        children?: React.ReactNode
        className?: string
        style?: React.CSSProperties
      }
      const elementChildren = elementProps.children

      // If it's a span element, preserve its props and process children
      if (node.type === 'span' || (typeof node.type === 'string' && node.type === 'span')) {
        const spanClassName = elementProps.className
        const spanStyle = elementProps.style
        const hasNowrap = spanClassName?.includes('whitespace-nowrap')

        // Process children of the span
        if (elementChildren) {
          if (hasNowrap) {
            // For whitespace-nowrap, keep all content together as a single word
            const collectText = (childNode: React.ReactNode): string => {
              if (typeof childNode === 'string' || typeof childNode === 'number') {
                return String(childNode)
              } else if (React.isValidElement(childNode)) {
                const props = childNode.props as { children?: React.ReactNode }
                if (props.children) {
                  const mappedChildren = React.Children.map(props.children, collectText)
                  return Array.isArray(mappedChildren) ? mappedChildren.join('') : ''
                }
              } else if (Array.isArray(childNode)) {
                return childNode.map(collectText).join('')
              }
              return ''
            }
            const fullText = React.Children.map(elementChildren, collectText)?.join('') || ''
            words.push({
              text: fullText,
              className: spanClassName,
              style: spanStyle,
              isSpan: true,
              keepTogether: true,
            })
          } else {
            // Normal processing: split by spaces
            React.Children.forEach(elementChildren, (child) => {
              if (typeof child === 'string' || typeof child === 'number') {
                const text = String(child)
                const textWords = text.split(/(\s+)/)
                textWords.forEach((word) => {
                  if (word.trim()) {
                    words.push({
                      text: word,
                      className: spanClassName,
                      style: spanStyle,
                      isSpan: true,
                    })
                  } else if (word) {
                    words.push({ text: word, isSpan: false })
                  }
                })
              } else {
                processNode(child)
              }
            })
          }
        }
      } else {
        // For other elements, process their children
        if (elementChildren) {
          React.Children.forEach(elementChildren, processNode)
        }
      }
    } else if (Array.isArray(node)) {
      node.forEach(processNode)
    }
  }

  processNode(children)
  return words
}

function TextGenerateEffect({
  ref,
  children,
  className,
  filter = true,
  duration = 1.0,
  staggerDelay = 0.1,
  ...props
}: TextGenerateEffectProps) {
  const localRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLDivElement)

  const [scope, animate] = useAnimate()
  const wordsArray = React.useMemo(() => extractWords(children), [children])

  React.useEffect(() => {
    if (scope.current) {
      animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration,
          delay: stagger(staggerDelay),
        },
      )
    }
  }, [animate, duration, filter, scope, staggerDelay])

  return (
    <div ref={localRef} className={className} data-slot="text-generate-effect" {...(props as any)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word.text}-${idx}`}
            className={`opacity-0 will-change-transform will-change-opacity will-change-filter ${
              word.className || ''
            }`}
            style={{
              filter: filter ? 'blur(10px)' : 'none',
              whiteSpace: word.keepTogether ? 'nowrap' : undefined,
              ...word.style,
            }}
          >
            {word.className?.includes('underline-text') ? (
              <span className="relative inline-block animate-pulse">
                {word.text}
                <BackgroundGradient
                  containerClassName="absolute bottom-0 left-0 right-0 h-[3px]"
                  className="h-full"
                  animate={true}
                />
              </span>
            ) : (
              word.text
            )}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
export { TextGenerateEffect, type TextGenerateEffectProps }
