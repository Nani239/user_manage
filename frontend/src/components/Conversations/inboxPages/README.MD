## offer MESSAGE status

## messageStatus === 0 `unread` - admin and provider can see the message

## messageStatus === 1 `read` - admin and provider can see the message (Approve or Reject by admin)

## messageStatus === 2 `Admin rejected offer` - admin & provider can see the message (no buttons)

## messageStatus === 3 `Admin Approved offer` - admin & provider & user can see the message (Accept, Reject or Negotiate by user)

## messageStatus === 4 `customer Accepted offer` - admin and provider & user can see the message (no butons)

## messageStatus === 5 `customer Rejected offer`- admin and provider & user can see the message (no buttons)

## messageStatus === 6 `customer Negotiated offer `- admin and provider & user can see the message (Accept, Reject or Negotiate reciver can see buttons)

## messageStatus === 7 `Offer negotiated` and created other message - admin and provider & user can see the message (no buttons)

## messageStatus === 8 `text message` nothimng will shown

##

## offer Zoom Status status

##

## ZoomStatus === 0 call `not Schudled` button name schudle call

## ZoomStatus === 1 call `schudled await accep`t host (await accept, joine accept the call)

## ZoomStatus === 2 call `rejected`

## ZoomStatus === 3 call `accepted launch the call` for both

## ZoomStatus === 4 call `re-schudleded` View call / await

## ZoomStatus === 5 call `not attended` by any one or both

## ZoomStatus === 6 both `attended` the call

##

## post type

## `message` 1 or `requestQuote` 2 or `offer my service` 3

##

## const SomeComponent = React.lazy(() => import('./SomeComponent'));

<!-- needs Status -->

## status == 0 `pending`

## status == 1 `Active`

## status == 2 `delete`

## status == 3 `expired / paused`

<!-- connection Status -->

## connectionStatus == 0 `Pending`
## connectionStatus == 1 `Accept`
## connectionStatus == 2 `Rejected`

<!-- jobs Status -->

## jobStatus == 0 `pending`
## jobStatus == 1 `Accept`
## jobStatus == 2 `Rejected`




